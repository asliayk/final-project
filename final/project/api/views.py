import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from datetime import datetime
from typing import ValuesView
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from django.db.models import Q, Avg

from api.models import Doctor, Patient, Visit, TSNEImg, AgeGraphsImg, SelectedModel
from api.serializers import DoctorSerializer, PatientSerializer, VisitSerializer, TSNESerializer, AgeGraphsSerializer, SelectedModelSerializer
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
import seaborn as sns

from sklearn.metrics import roc_auc_score, average_precision_score, plot_roc_curve
from sklearn import metrics
from sklearn.metrics import confusion_matrix
import base64

from copy import deepcopy as dc
from sklearn.decomposition import PCA

import torch
from classifier import Classifier


from torch import nn
from django.db.models import Count
from django.db.models.functions import Cast
import math
import time
from scipy.special import softmax

#np.random.seed(0)

# Create your views here.
def timestamped_name(num):
    postfix = str(num) + "img.png"     
    timestamp = str(int(time.time()*10000000))
    img_name = timestamp + postfix
    return img_name


def get_onehot_columns(df, cat_col_list):
    for i in cat_col_list:
        df[i] = df[i].astype(str)
    oh_df = pd.DataFrame()
    for i in cat_col_list:
        temp = pd.get_dummies(df[i])
        temp.columns = [str(col) + '_{}'.format(i) for col in temp.columns]
        oh_df = pd.concat([oh_df, temp], axis=1)
    df = df.drop(cat_col_list, axis=1)
    df = pd.concat([df, oh_df], axis=1)
    return df    

def do_padding(matrices, value, maxlen=None):
    if maxlen is None:
        maxlen = max(len(m) for m in matrices)
    ret = [np.pad(m, [(0, maxlen - len(m)), (0, 0)], 'constant', constant_values=(value, value))[:, None, :] for m in matrices]
    return np.concatenate(ret, axis=1)

def prepare_model_data_2d(dat, test_ratio, pad_value, num_column_list, target_col="DX", selected_labels=None, isTSNE=False, isSimilar=False):
    id_column = 'PTID'
    date_column = 'VISCODE'
 
    if isTSNE or isSimilar:
        dat = dat[dat['DX'].isin(selected_labels)]
 
    scaler_x = StandardScaler()
    scaler_x.fit(dat[num_column_list])
    
    dat[num_column_list] = scaler_x.transform(dat[num_column_list])
    
 
    label_num = dat[target_col].nunique()
    dat = pd.concat([dat.drop(target_col, axis=1), pd.get_dummies(dat[target_col])], axis=1)
 
    patients = np.array(dat.sort_values([id_column, date_column])[id_column].tolist())
  
    #-n values = np.array(dat.sort_values([id_column, date_column]).iloc[:, 2:-(label_num)].values)
    #-n labels = np.array(dat.sort_values([id_column, date_column]).iloc[:, -(label_num):].values)
    values = np.array(dat.iloc[:, 2:-(label_num)].values)
    labels = np.array(dat.iloc[:, -(label_num):].values)

 
    """ 
    idx = int(len(values) * (1 - test_ratio))
    X_train = np.asarray(values[:idx, :]).astype('float32')
    y_train = np.asarray(labels[:idx, :]).astype('float32')
    pt_train = patients[:idx]
    X_test = np.asarray(values[idx:, :]).astype('float32')
    y_test = np.asarray(labels[idx:, :]).astype('float32')
    pt_test = patients[idx:]
    return X_train, y_train, pt_train, X_test, y_test, pt_test
    
    """ 
    

    return values

def data_preprocessing(data, columns, features_list, selected_months, is_2d, interpolation, isSimilar=False, isTSNE=False):
    id_column, date_column, label_column = columns
    df = data[features_list + [label_column]]
 
    months_list = [0] + [int(x[-2:]) for x in df[date_column].unique() if x != 'bl']
    time_dict = dict(zip(df[date_column].unique(), months_list))


    num_column_list = sorted([col for col in df.select_dtypes(include=["int", "int64", "float","float32","int32","float64"]).columns if
                              col not in [id_column, date_column, label_column]])
  
    cat_column_list = sorted([col for col in df.select_dtypes(include=['category', 'object']).columns if
                              col not in [id_column, date_column, label_column]])
  
    
    df = get_onehot_columns(df, cat_column_list)
   
    df[date_column] = df[date_column].apply(lambda x: time_dict[x])

    if is_2d:
        valid_ids = df.groupby(id_column).nunique().query("{}>3".format(date_column)).index.tolist()
    
    else:
        df = df[df[date_column].isin(selected_months)]
        valid_ids = df.groupby(id_column).nunique().query("{}=={}".format(date_column, len(selected_months))).index.tolist()
    #df = df[df[id_column].isin(valid_ids)]


    #-n df = df.sort_values([id_column, date_column])
 
   
    if interpolation:
        df[[id_column, date_column] + num_column_list] = df[[id_column, date_column] + num_column_list].groupby(
            id_column).apply(lambda x: x.interpolate())
     
    df = df.groupby(id_column).apply(lambda x: x.fillna(method="ffill"))  # -already commented- .fillna(method="bfill"))
    # -already commented- df = df.fillna(df.mean())

    
   
    for col in num_column_list:
        df[col] = df[col].fillna(df.groupby(label_column)[col].transform('mean'))

    
    for col in num_column_list:
        val = Visit.objects.all().aggregate(Avg(col))
        av = val[str(col+"__avg")]
        df[col] = df[col].fillna(int(av))  


    #-mapping = {k: v for v, k in enumerate(sorted(df[id_column].unique()))}
    #-df[id_column] = df[id_column].map(mapping)


    #-already commented- diag = df.groupby(id_column).last().reset_index().query("DX in {}".format(['NL', 'Dementia', 'MCI']))[id_column].tolist()
    #-already commented- df =  df[df[id_column].isin(diag)]

    if isSimilar or isTSNE:
        df = df.dropna()
  
    #-n return df, num_column_list, cat_column_list, mapping
    return df, num_column_list, cat_column_list

@csrf_exempt
def getVisits(request):
    if request.method == 'GET':
        visitss = Visit.objects.all()
        visits_serializer = VisitSerializer(visitss,many=True)
        return JsonResponse({"status": {"success": True, "message": "Successfully fetched"},"visits": visits_serializer.data},status=200)

@csrf_exempt
def getStatistics(request):
    if request.method == 'GET':
        total = Patient.objects.all().count()  

        model = SelectedModel.objects.first()
        model_serializer = SelectedModelSerializer(model)
        selected_model = model_serializer.data["ClassNum"]
        avg_age = Patient.objects.all().aggregate(Avg("AGE"))["AGE__avg"]
        avg_age = str(float("{:.2f}".format(avg_age)))

        qPatientLabels = list(Patient.objects.values('DX').order_by().annotate(Count('DX')))
        MCI_count = str(0)
        Dementia_count = str(0)
        NL_count = str(0)
        MCI_to_NL_count = str(0)
        MCI_to_Dementia_count = str(0)
        Dementia_to_MCI_count = str(0)
        NL_to_MCI_count = str(0)
        NL_to_Dementia_count = str(0)
        for item in qPatientLabels:
            if item["DX"]=="MCI":
                MCI_count = str(item["DX__count"])
            elif item["DX"]=="Dementia":
                Dementia_count = str(item["DX__count"])
            elif item["DX"]=="NL":
                NL_count = str(item["DX__count"])
            elif item["DX"]=="MCI to NL":
                MCI_to_NL_count = str(item["DX__count"])
            elif item["DX"]=="MCI to Dementia":
                MCI_to_Dementia_count = str(item["DX__count"])    
            elif item["DX"]=="Dementia to MCI":
                Dementia_to_MCI_count = str(item["DX__count"])   
            elif item["DX"]=="NL to MCI":
                NL_to_MCI_count = str(item["DX__count"])    
            elif item["DX"]=="NL to Dementia":
                NL_to_Dementia_count = str(item["DX__count"])                     

        qGender = list(Patient.objects.values('PTGENDER').order_by().annotate(Count('PTGENDER')))
        for item in qGender:
            if item["PTGENDER"]=='Female':
                FemalePercentage = str(float("{:.2f}".format((item["PTGENDER__count"]/total)*100)))
            elif item["PTGENDER"]=='Male':
                MalePercentage = str(float("{:.2f}".format((item["PTGENDER__count"]/total)*100)))    
    
        qMarry = list(Patient.objects.values('PTMARRY').order_by().annotate(Count('PTMARRY')))
        for item in qMarry:
            if item["PTMARRY"]=='Married':
                MarriedPercentage_m = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))
            elif item["PTMARRY"]=='Divorced':
                DivorcedPercentage_m = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))  
            elif item["PTMARRY"]=='Never married':
                NeverMarriedPercentage_m = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))     
            elif item["PTMARRY"]=='Unknown':
                UnknownPercentage_m = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))    
            elif item["PTMARRY"]=='Widowed':
                WidowedPercentage_m = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))      


        qRaccat = list(Patient.objects.values('PTRACCAT').order_by().annotate(Count('PTRACCAT')))
        for item in qRaccat:
            if item["PTRACCAT"]=='White':
                WhitePercentage_race = str(float("{:.2f}".format((item["PTRACCAT__count"]/total)*100)))
            elif item["PTRACCAT"]=='Asian':
                AsianPercentage_race = str(float("{:.2f}".format((item["PTRACCAT__count"]/total)*100)))  
            elif item["PTRACCAT"]=='Black':
                BlackPercentage_race = str(float("{:.2f}".format((item["PTRACCAT__count"]/total)*100)))     
            elif item["PTRACCAT"]=='Unknown':
                UnknownPercentage_race = str(float("{:.2f}".format((item["PTRACCAT__count"]/total)*100)))    
            elif item["PTRACCAT"]=='More than one':
                MoreThanOnePercentage_race = str(float("{:.2f}".format((item["PTRACCAT__count"]/total)*100))) 
            elif item["PTRACCAT"]=='Am Indian/Alaskan':
                AmIndianAlaskanPercentage_race = str(float("{:.2f}".format((item["PTRACCAT__count"]/total)*100)))     
            elif item["PTRACCAT"]=='Hawaiian/Other PI':
                HawaiianPercentage_race = str(float("{:.2f}".format((item["PTRACCAT__count"]/total)*100)))   

        qNL = list(Patient.objects.filter(DX="NL").values('PTMARRY').order_by().annotate(Count('PTMARRY')))
        total = len(list(Patient.objects.filter(DX="NL")))
        for item in qNL:
            if item["PTMARRY"]=='Never married':
                NL_NeverMarried = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))
            elif item["PTMARRY"]=='Married':
                NL_Married = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))  
            elif item["PTMARRY"]=='Widowed':
                NL_Widowed = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))     
            elif item["PTMARRY"]=='Divorced':
                NL_Divorced = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))   

        qMCI = list(Patient.objects.filter(DX="MCI").values('PTMARRY').order_by().annotate(Count('PTMARRY')))
        total = len(list(Patient.objects.filter(DX="MCI")))
        for item in qMCI:
            if item["PTMARRY"]=='Never married':
                MCI_NeverMarried = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))
            elif item["PTMARRY"]=='Married':
                MCI_Married = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))  
            elif item["PTMARRY"]=='Widowed':
                MCI_Widowed = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))     
            elif item["PTMARRY"]=='Divorced':
                MCI_Divorced = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100))) 

        qDementia = list(Patient.objects.filter(DX="Dementia").values('PTMARRY').order_by().annotate(Count('PTMARRY')))
        total = len(list(Patient.objects.filter(DX="Dementia")))
        for item in qDementia:
            if item["PTMARRY"]=='Never married':
                Dementia_NeverMarried = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))
            elif item["PTMARRY"]=='Married':
                Dementia_Married = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))  
            elif item["PTMARRY"]=='Widowed':
                Dementia_Widowed = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))     
            elif item["PTMARRY"]=='Divorced':
                Dementia_Divorced = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100))) 

        qMCItoNL = list(Patient.objects.filter(DX="MCI to NL").values('PTMARRY').order_by().annotate(Count('PTMARRY')))
        total = len(list(Patient.objects.filter(DX="MCI to NL")))
        MCItoNL_NeverMarried = str(0)
        MCItoNL_Married = str(0)
        MCItoNL_Widowed = str(0)
        MCItoNL_Divorced = str(0)
        for item in qMCItoNL:
            if item["PTMARRY"]=='Never married':
                MCItoNL_NeverMarried = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))
            elif item["PTMARRY"]=='Married':
                MCItoNL_Married = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))  
            elif item["PTMARRY"]=='Widowed':
                MCItoNL_Widowed = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))     
            elif item["PTMARRY"]=='Divorced':
                MCItoNL_Divorced = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100))) 

        qMCItoDementia = list(Patient.objects.filter(DX="MCI to Dementia").values('PTMARRY').order_by().annotate(Count('PTMARRY')))
        total = len(list(Patient.objects.filter(DX="MCI to Dementia")))
        MCItoDementia_NeverMarried = str(0)
        MCItoDementia_Married = str(0)
        MCItoDementia_Widowed = str(0)
        MCItoDementia_Divorced = str(0)
        for item in qMCItoDementia:
            if item["PTMARRY"]=='Never married':
                MCItoDementia_NeverMarried = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))
            elif item["PTMARRY"]=='Married':
                MCItoDementia_Married = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))  
            elif item["PTMARRY"]=='Widowed':
                MCItoDementia_Widowed = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))     
            elif item["PTMARRY"]=='Divorced':
                MCItoDementia_Divorced = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100))) 

        qNLtoMCI = list(Patient.objects.filter(DX="NL to MCI").values('PTMARRY').order_by().annotate(Count('PTMARRY')))
        total = len(list(Patient.objects.filter(DX="NL to MCI")))
        NLtoMCI_NeverMarried = str(0)
        NLtoMCI_Married = str(0)
        NLtoMCI_Widowed = str(0)
        NLtoMCI_Divorced = str(0)
        for item in qNLtoMCI:
            if item["PTMARRY"]=='Never married':
                NLtoMCI_NeverMarried = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))
            elif item["PTMARRY"]=='Married':
                NLtoMCI_Married = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))  
            elif item["PTMARRY"]=='Widowed':
                NLtoMCI_Widowed = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))     
            elif item["PTMARRY"]=='Divorced':
                NLtoMCI_Divorced = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100))) 

        qDementiatoMCI = list(Patient.objects.filter(DX="Dementia to MCI").values('PTMARRY').order_by().annotate(Count('PTMARRY')))
        total = len(list(Patient.objects.filter(DX="Dementia to MCI")))
        DementiatoMCI_NeverMarried = str(0)
        DementiatoMCI_Married = str(0)
        DementiatoMCI_Widowed = str(0)
        DementiatoMCI_Divorced = str(0)
        for item in qDementiatoMCI:
            if item["PTMARRY"]=='Never married':
                DementiatoMCI_NeverMarried = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))
            elif item["PTMARRY"]=='Married':
                DementiatoMCI_Married = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))  
            elif item["PTMARRY"]=='Widowed':
                DementiatoMCI_Widowed = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))     
            elif item["PTMARRY"]=='Divorced':
                DementiatoMCI_Divorced = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100))) 

        qNLtoDementia = list(Patient.objects.filter(DX="NL to Dementia").values('PTMARRY').order_by().annotate(Count('PTMARRY'))) 
        total = len(list(Patient.objects.filter(DX="NL to Dementia")))
        NLtoDementia_NeverMarried = str(0)
        NLtoDementia_Married = str(0)
        NLtoDementia_Widowed = str(0)
        NLtoDementia_Divorced = str(0)
        for item in qNLtoDementia:
            if item["PTMARRY"]=='Never married':
                NLtoDementia_NeverMarried = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))
            elif item["PTMARRY"]=='Married':
                NLtoDementia_Married = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))  
            elif item["PTMARRY"]=='Widowed':
                NLtoDementia_Widowed = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))     
            elif item["PTMARRY"]=='Divorced':
                NLtoDementia_Divorced = str(float("{:.2f}".format((item["PTMARRY__count"]/total)*100)))  
      

        qFemaleLabels = list(Patient.objects.filter(PTGENDER="Female").values('DX').order_by().annotate(Count('DX')))
        total = len(list(Patient.objects.filter(~Q(DX=""),~Q(DX=None),PTGENDER="Female")))
        Female_MCI = str(0)
        Female_NL = str(0)
        Female_Dementia = str(0)
        Female_NLtoMCI = str(0)
        Female_MCItoDementia = str(0)
        Female_MCItoNL = str(0)
        Female_DementiatoMCI = str(0)
        Female_NLtoDementia = str(0)
        for item in qFemaleLabels:
            if item["DX"]=='MCI':
                Female_MCI = str(float("{:.2f}".format((item["DX__count"]/total)*100)))
            elif item["DX"]=='NL':
                Female_NL = str(float("{:.2f}".format((item["DX__count"]/total)*100)))  
            elif item["DX"]=='Dementia':
                Female_Dementia = str(float("{:.2f}".format((item["DX__count"]/total)*100)))     
            elif item["DX"]=='NL to MCI':
                Female_NLtoMCI = str(float("{:.2f}".format((item["DX__count"]/total)*100)))
            elif item["DX"]=='MCI to Dementia':
                Female_MCItoDementia = str(float("{:.2f}".format((item["DX__count"]/total)*100)))
            elif item["DX"]=='MCI to NL':
                Female_MCItoNL = str(float("{:.2f}".format((item["DX__count"]/total)*100))) 
            elif item["DX"]=='Dementia to MCI':
                Female_DementiatoMCI = str(float("{:.2f}".format((item["DX__count"]/total)*100)))   
            elif item["DX"]=='NL to Dementia':
                Female_NLtoDementia = str(float("{:.2f}".format((item["DX__count"]/total)*100)))             


        qMaleLabels = list(Patient.objects.filter(PTGENDER="Male").values('DX').order_by().annotate(Count('DX'))) 
        total = len(list(Patient.objects.filter(~Q(DX=""),~Q(DX=None),PTGENDER="Male")))
        Male_MCI = str(0)
        Male_NL = str(0)
        Male_Dementia = str(0)
        Male_NLtoMCI = str(0)
        Male_MCItoDementia = str(0)
        Male_MCItoNL = str(0)
        Male_DementiatoMCI = str(0)
        Male_NLtoDementia = str(0)
        for item in qMaleLabels:
            if item["DX"]=='MCI':
                Male_MCI = str(float("{:.2f}".format((item["DX__count"]/total)*100)))
            elif item["DX"]=='NL':
                Male_NL = str(float("{:.2f}".format((item["DX__count"]/total)*100)))  
            elif item["DX"]=='Dementia':
                Male_Dementia = str(float("{:.2f}".format((item["DX__count"]/total)*100)))     
            elif item["DX"]=='NL to MCI':
                Male_NLtoMCI = str(float("{:.2f}".format((item["DX__count"]/total)*100)))
            elif item["DX"]=='MCI to Dementia':
                Male_MCItoDementia = str(float("{:.2f}".format((item["DX__count"]/total)*100)))
            elif item["DX"]=='MCI to NL':
                Male_MCItoNL = str(float("{:.2f}".format((item["DX__count"]/total)*100))) 
            elif item["DX"]=='Dementia to MCI':
                Male_DementiatoMCI = str(float("{:.2f}".format((item["DX__count"]/total)*100)))   
            elif item["DX"]=='NL to Dementia':
                Female_NLtoDementia = str(float("{:.2f}".format((item["DX__count"]/total)*100)))                     
  

        statistics = {"AvgAge": avg_age, "FemalePercentage": FemalePercentage, "MarriedPercentage_m": MarriedPercentage_m,
        "WidowedPercentage_m": WidowedPercentage_m, "NeverMarriedPercentage_m": NeverMarriedPercentage_m, "DivorcedPercentage_m": DivorcedPercentage_m,
        "UnknownPercentage_m": UnknownPercentage_m, "WhitePercentage_race": WhitePercentage_race, "BlackPercentage_race": BlackPercentage_race,
        "AsianPercentage_race": AsianPercentage_race, "UnknownPercentage_race": UnknownPercentage_race, "AmIndianAlaskanPercentage_race": AmIndianAlaskanPercentage_race,
        "MoreThanOnePercentage_race": MoreThanOnePercentage_race, "HawaiianPercentage_race": HawaiianPercentage_race,
        "NL_NeverMarried": NL_NeverMarried, "NL_Married": NL_Married, "NL_Widowed": NL_Widowed, "NL_Divorced": NL_Divorced,
        "MCI_NeverMarried": MCI_NeverMarried, "MCI_Married": MCI_Married, "MCI_Widowed": MCI_Widowed, "MCI_Divorced": MCI_Divorced,
        "Dementia_NeverMarried": Dementia_NeverMarried, "Dementia_Married": Dementia_Married, "Dementia_Widowed": Dementia_Widowed, "Dementia_Divorced": Dementia_Divorced,
        "MCItoNL_NeverMarried": MCItoNL_NeverMarried, "MCItoNL_Married": MCItoNL_Married, "MCItoNL_Widowed": MCItoNL_Widowed, "MCItoNL_Divorced": MCItoNL_Divorced,
        "MCItoDementia_NeverMarried": MCItoDementia_NeverMarried, "MCItoDementia_Married": MCItoDementia_Married, "MCItoDementia_Widowed": MCItoDementia_Widowed, "MCItoDementia_Divorced": MCItoDementia_Divorced,
        "NLtoMCI_NeverMarried": NLtoMCI_NeverMarried, "NLtoMCI_Married": NLtoMCI_Married, "NLtoMCI_Widowed": NLtoMCI_Widowed, "NLtoMCI_Divorced": NLtoMCI_Divorced,
        "DementiatoMCI_NeverMarried": DementiatoMCI_NeverMarried, "DementiatoMCI_Married": DementiatoMCI_Married, "DementiatoMCI_Widowed": DementiatoMCI_Widowed, "DementiatoMCI_Divorced": DementiatoMCI_Divorced,
        "NLtoDementia_NeverMarried": NLtoDementia_NeverMarried, "NLtoDementia_Married": NLtoDementia_Married, "NLtoDementia_Widowed": NLtoDementia_Widowed, "NLtoDementia_Divorced": NLtoDementia_Divorced,
        "Female_MCI": Female_MCI, "Female_NL": Female_NL, "Female_Dementia": Female_Dementia,"Female_NLtoMCI": Female_NLtoMCI, "Female_MCItoDementia": Female_MCItoDementia, "Female_MCItoNL": Female_MCItoNL, "Female_DementiatoMCI": Female_DementiatoMCI, "Female_NLtoDementia": Female_NLtoDementia,
        "Male_MCI": Male_MCI, "Male_NL": Male_NL, "Male_Dementia": Male_Dementia,"Male_NLtoMCI": Male_NLtoMCI,"Male_MCItoDementia": Male_MCItoDementia, "Male_MCItoNL": Male_MCItoNL, "Male_DementiatoMCI": Male_DementiatoMCI, "Male_NLtoDementia": Male_NLtoDementia,
        "MCI_count": MCI_count, "Dementia_count": Dementia_count, "NL_count": NL_count, "MCI_to_Dementia_count": MCI_to_Dementia_count, "MCI_to_NL_count": MCI_to_NL_count, "NL_to_MCI_count": NL_to_MCI_count, "Dementia_to_MCI_count": Dementia_to_MCI_count, "NL_to_Dementia_count": NL_to_Dementia_count,
        "selected_model": selected_model
        
        }

        slist = []
        slist.append(statistics)
        return JsonResponse({"status": {"success": True, "message": "Successfully fetched"},"statistics": slist},status=200)         


@csrf_exempt
def getDoctors(request):
    if request.method == 'GET':
        doctors = Doctor.objects.all()
        doctor_serializer = DoctorSerializer(doctors,many=True)
        return JsonResponse({"status": {"success": True, "message": "Successfully fetched"},"doctors": doctor_serializer.data},status=200) 

@csrf_exempt
def getModel(request):
    if request.method == 'GET':
        selected_model = SelectedModel.objects.first().ClassNum
        return JsonResponse({"status": {"success": True, "message": "Successfully fetched"},"model": selected_model},status=200)         

@csrf_exempt
def getPatients(request):
    if request.method == 'GET':
        patients = Patient.objects.all()
        patient_serializer = PatientSerializer(patients,many=True)
        return JsonResponse({"status": {"success": True, "message": "Successfully fetched"},"patients": patient_serializer.data},status=200)       

@csrf_exempt
def addDoctor(request):
    if request.method == 'POST':
        doctor_data = JSONParser().parse(request)
        doctor_serializer = DoctorSerializer(data=doctor_data)
        if doctor_serializer.is_valid():
            doctor_serializer.save()
            return JsonResponse({"status": {"success": True, "message": "Doctor is added successfully"}},status=200)   
        return JsonResponse({"status": {"success": False, "message": "Doctor couldn't be added"}},status=400) 

@csrf_exempt
def addPatient(request):
    if request.method == 'POST':
        patient_data = JSONParser().parse(request)
        patient_serializer = PatientSerializer(data=patient_data)
        if patient_serializer.is_valid():
            patient_serializer.save()
            if AgeGraphsImg.objects.filter(isUpdated=True) is not None:
                AgeGraphsImg.objects.filter(ID="1").update(isUpdated=False)
            return JsonResponse({"status": {"success": True, "message": "Patient is added successfully"}, "pid":patient_serializer.data['PTID']},status=200)  
        return JsonResponse({"status": {"success": False, "message": "Patient couldn't be added"}},status=400)  

@csrf_exempt
def addVisit(request):
    if request.method == 'POST':
        visit_data = JSONParser().parse(request)
        patient = Patient.objects.filter(PTID=visit_data['PTID']).first()
        if patient is None:
            return JsonResponse({"status": {"success": True, "message": "There is no patient with that PTID"}},status=200)  
        visit_serializer = VisitSerializer(data=visit_data)
        if visit_serializer.is_valid():
            visit_serializer.save()
            if TSNEImg.objects.filter(isUpdated=True) is not None:
                TSNEImg.objects.filter(ID="1").update(isUpdated=False)

            return JsonResponse({"status": {"success": True, "message": "Visit is added successfully"}},status=200)   
        return JsonResponse({"status": {"success": False, "message": "Visit couldn't be added"}},status=400)  

@csrf_exempt
def loginDoctor(request):
    if request.method == 'POST':
        doctor_data = JSONParser().parse(request)
        if Doctor.objects.filter(DoctorId=doctor_data['DoctorId']).first() is None:
            return JsonResponse({"status": {"success": False, "message": "There is no doctor with that id"}},status=400)   
        doctor = Doctor.objects.filter(DoctorId=doctor_data['DoctorId'], Password=doctor_data['Password']).first()
        if doctor is None:
            return JsonResponse({"status": {"success": False, "message": "Wrong password"}},status=400)  
        doctor_serializer = DoctorSerializer(doctor)            
        return JsonResponse({"status": {"success": True, "message": "Successfully logged in"},"doctor": doctor_serializer.data}, status=200)

@csrf_exempt
def updateDoctor(request):  
    if request.method == 'PUT':
        doctor_data = JSONParser().parse(request)
        doctor = Doctor.objects.get(DoctorId=doctor_data['DoctorId'])
        doctor_serializer = DoctorSerializer(doctor,data=doctor_data)
        if doctor_serializer.is_valid():
            doctor_serializer.save()
            return JsonResponse({"status": {"success": True,"message": "Updated successfully"}},status=200)
        return JsonResponse({"status": {"success": False,"message": "Update unsuccessful"}},status=400)   

@csrf_exempt
def selectModel(request):  
    if request.method == 'PUT':
        model_data = JSONParser().parse(request)
        model = SelectedModel.objects.get(ID=model_data["ID"])
        model_serializer = SelectedModelSerializer(model,data=model_data)
        if model_serializer.is_valid():
            model_serializer.save()
            if TSNEImg.objects.filter(isUpdated=True) is not None:
                TSNEImg.objects.filter(ID="1").update(isUpdated=False)
            return JsonResponse({"status": {"success": True,"message": "Updated successfully"}},status=200)
        return JsonResponse({"status": {"success": False,"message": "Update unsuccessful"}},status=400)           

@csrf_exempt
def updatePatient(request):  
    if request.method == 'PUT':
        patient_data = JSONParser().parse(request)
        patient = Patient.objects.get(PTID=patient_data['PTID'])
        patient_serializer = PatientSerializer(patient,data=patient_data)
        if patient_serializer.is_valid():
            patient_serializer.save()
            if AgeGraphsImg.objects.filter(isUpdated=True) is not None:
                AgeGraphsImg.objects.filter(ID="1").update(isUpdated=False)
            return JsonResponse({"status": {"success": True,"message": "Updated successfully"}},status=200) 
        return JsonResponse({"status": {"success": False,"message": "Update unsuccessful"}},status=400)          

@csrf_exempt
def deleteDoctor(request,id):   
    if request.method == 'DELETE':    
        print(id)     
        doctor = Doctor.objects.get(DoctorId=id)
        doctor.delete()
        return JsonResponse({"status": {"success": True,"message": "successfully deleted"}},status=200)

@csrf_exempt
def deletePatient(request,id):   
    if request.method == 'DELETE':         
        patient = Patient.objects.get(PTID=id)
        patient.delete()
        visits = Visit.objects.filter(PTID=id)
        visits.delete()
        if AgeGraphsImg.objects.filter(isUpdated=True) is not None:
            AgeGraphsImg.objects.filter(ID="1").update(isUpdated=False)
        return JsonResponse({"status": {"success": True,"message": "successfully deleted"}},status=200)    

@csrf_exempt
def deleteVisit(request):   
    if request.method == 'DELETE': 
        visit_data = JSONParser().parse(request)         
        visit = Visit.objects.get(RID=visit_data['RID'],PTID=visit_data['PTID'],VISCODE=visit_data['VISCODE'])
        visit.delete()
        if TSNEImg.objects.filter(isUpdated=True) is not None:
            TSNEImg.objects.filter(ID="1").update(isUpdated=False)
        return JsonResponse({"status": {"success": True,"message": "successfully deleted"}},status=200)              

@csrf_exempt
def getDoctorProfile(request,num):  
    if request.method == 'GET': 
        if Doctor.objects.filter(DoctorId=num).first() is None:
            return JsonResponse({"status": {"success": False,"message": "There is no doctor with that id"}},status=400)
        doctor = Doctor.objects.filter(DoctorId=num).first()
        doctor_serializer = DoctorSerializer(doctor)
        patients = Patient.objects.all()
        patient_serializer = PatientSerializer(patients,many=True)
        return JsonResponse({"status": {"success": True, "message": "Successfully fetched"},"doctor": doctor_serializer.data,"patients":patient_serializer.data},status=200)       

@csrf_exempt
def getPatientProfile(request,id): 
    if request.method == 'GET': 
        if Patient.objects.filter(PTID=id).first() is None:
            return JsonResponse({"status": {"success": False,"message": "There is no patient with that id"}},status=400)

        features = ['RAVLT_immediate','ADAS11','ADAS13','MMSE',
        'Hippocampus',
        'WholeBrain',
        'FDG',
        'MidTemp',
        'Entorhinal',
        'Fusiform','ICV',
        'APOE4','Ventricles',"FAQ", "CDRSB","AGE"]    

        selected_model = SelectedModel.objects.first().ClassNum
        features_bl = []
        if selected_model=="8":
            model_path='api/deneme_model_lastt_8.pth'
            s_labels = ["Dementia","Dementia to MCI","MCI","MCI to Dementia","MCI to NL","NL","NL to Dementia","NL to MCI"]
            features_bl = [x + "_bl" for x in features if x not in ['APOE4','M','AGE']]
        elif selected_model=="2":
            model_path='api/deneme_model_upf_2.pth'
            s_labels = ["Dementia","MCI"]
        elif selected_model=="3":
            model_path='api/deneme_model_upf_3.pth'
            s_labels = ["Dementia","MCI","NL"]
        else:
            model_path='api/deneme_model_upf_4.pth'
            s_labels = ["Dementia","MCI to Dementia","NL","NL to MCI"]  

        if selected_model!="8":
            features = ['AGE', 'APOE4', 'CDRSB', 'ADAS11', 'ADAS13', 'MMSE', 'RAVLT_immediate', 'RAVLT_learning', 'RAVLT_forgetting', 'RAVLT_perc_forgetting', 'FAQ', 'Ventricles', 'Hippocampus',
            'WholeBrain', 'Entorhinal', 'Fusiform', 'MidTemp', 'ICV']   
    
        patient = Patient.objects.filter(PTID=id).first()
        patient_serializer = PatientSerializer(patient)
        
        visits = Visit.objects.filter(PTID=id)
        sortedvisits = list(sorted(visits.values(), key=lambda x: datetime.strptime(x['EXAMDATE'], '%d.%m.%Y')))
        sortedvisits.reverse()

        visit_serializer = VisitSerializer(sortedvisits,many=True)
        df = pd.DataFrame(visit_serializer.data)
        if df.empty:
          return JsonResponse({"status": {"success": True,"message": "Successfully fetched"},"patient": patient_serializer.data,"visits":[]},status=200)   
        id_column = 'PTID'
        date_column = 'VISCODE'
        label_column = 'DX'
        pad_value = 10**5
        selected_months = [0, 6, 12, 18, 24]
        
       
       

        features_list = sorted(features + features_bl)
       
        cols = [id_column, date_column] + features_list
        data_2d, num_column_list, cat_column_list = data_preprocessing(dc(df), (id_column, date_column, label_column), cols, selected_months, is_2d=True, interpolation=False)
      
        values = prepare_model_data_2d(data_2d, 0.2, pad_value, num_column_list, selected_labels=s_labels)     
        values = values.astype(np.float32)
          
        

        seed = 0
        torch.manual_seed(seed)
        device = "cuda" if torch.cuda.is_available() else "cpu"
    
        model = torch.load(model_path).to(device)
        
        with torch.no_grad():
         values = torch.from_numpy(values).to(device)
         pred = model(values)

        m = softmax(np.array(pred),axis=1)
        
   
        for cat,visit,softm in zip(pred.argmax(1).numpy(),visit_serializer.data,m):
            visit.update({"category":str(s_labels[cat]),"softmax":str(softm[cat])[0:4]}) 
           
   
   
        return JsonResponse({"status": {"success": True,"message": "Successfully fetched"},"patient": patient_serializer.data,"visits":visit_serializer.data},status=200) 


@csrf_exempt
def getSimilarVisits(request): 
    if request.method == 'POST': 
        visits = Visit.objects.all()
        visit_data = JSONParser().parse(request)  
        vlist = list(visits.values())
        v_index = next((index for (index, d) in enumerate(vlist) if d["RID"] == visit_data['RID'] and d['PTID'] == visit_data['PTID'] and d['VISCODE'] == visit_data['VISCODE']), None)
        
        visit_serializer = VisitSerializer(vlist,many=True)
        df = pd.DataFrame(visit_serializer.data)
        

        id_column = 'PTID'
        date_column = 'VISCODE'
        label_column = 'DX'
        pad_value = 10**5
        selected_months = [0, 6, 12, 18, 24]

        features = ['RAVLT_immediate','ADAS11','ADAS13','MMSE',
        'Hippocampus',
        'WholeBrain',
        'FDG',
        'MidTemp',
        'Entorhinal',
        'Fusiform','ICV',
        'APOE4','Ventricles',"FAQ", "CDRSB","AGE"]    

        selected_model = SelectedModel.objects.first().ClassNum
        features_bl = []
        if selected_model=="8":
            model_path='api/deneme_model_lastt_8.pth'
            s_labels = ["Dementia","Dementia to MCI","MCI","MCI to Dementia","MCI to NL","NL","NL to Dementia","NL to MCI"]
            features_bl = [x + "_bl" for x in features if x not in ['APOE4','M','AGE']]
        elif selected_model=="2":
            model_path='api/deneme_model_upf_2.pth'
            s_labels = ["Dementia","MCI"]
        elif selected_model=="3":
            model_path='api/deneme_model_upf_3.pth'
            s_labels = ["Dementia","MCI","NL"]
        else:
            model_path='api/deneme_model_upf_4.pth'
            s_labels = ["Dementia","MCI to Dementia","NL","NL to MCI"]  

        if selected_model!="8":
            features = ['AGE', 'APOE4', 'CDRSB', 'ADAS11', 'ADAS13', 'MMSE', 'RAVLT_immediate', 'RAVLT_learning', 'RAVLT_forgetting', 'RAVLT_perc_forgetting', 'FAQ', 'Ventricles', 'Hippocampus',
            'WholeBrain', 'Entorhinal', 'Fusiform', 'MidTemp', 'ICV']
   

        features_list = sorted(features + features_bl)
        cols = [id_column, date_column] + features_list
        data_2d, num_column_list, cat_column_list = data_preprocessing(dc(df), (id_column, date_column, label_column), cols, selected_months, is_2d=True, interpolation=True)
        values = prepare_model_data_2d(data_2d, 0.2, pad_value, num_column_list, selected_labels=s_labels, isSimilar=True)
        values = values.astype(np.float32)

        """
        new_data = [list(y) for y in set([tuple(x) for x in values])]   
        print(len(values))
        print(len(new_data))
        """
      

        mainv = values[v_index]
     
        distances = []
        visits = []
        for i,v in enumerate(values):
          distances.append([vlist[i]['PTID'],vlist[i]['VISCODE'],vlist[i]['RID'],math.dist(mainv,v)])  

        distances.sort(key = lambda x: x[3]) 
        index = 0
        visit_values = []
        for distance in distances:
            if distance[0] !=visit_data['PTID']:
                visits.append(Visit.objects.get(RID=distance[2],PTID=distance[0],VISCODE=distance[1]))
                index=index+1
                v_index = next((index for (index, d) in enumerate(vlist) if d["RID"] == distance[2] and d['PTID'] == distance[0] and d['VISCODE'] == distance[1]), None) 
                visit_values.append(values[v_index])
            if index==5:
                break
        seed = 0
        torch.manual_seed(seed)
        device = "cuda" if torch.cuda.is_available() else "cpu"

        
        model = torch.load(model_path).to(device)

        with torch.no_grad():
         values = torch.from_numpy(np.asarray(visit_values)).to(device)
         pred = model(values)

        m = softmax(np.array(pred),axis=1)     

        visits_serializer = VisitSerializer(visits,many=True)
        visit = Visit.objects.get(RID=visit_data['RID'],PTID=visit_data['PTID'],VISCODE=visit_data['VISCODE'])
        visit_serializer = VisitSerializer(visit)  

        for cat,v,s in zip(pred.argmax(1).numpy(),visits_serializer.data,m):
            v.update({"category":str(s_labels[cat]),"softmax":str(s[cat])[0:4]})
            
      

        return JsonResponse({"status": {"success": True,"message": "Successfully fetched"},"visit":visit_serializer.data,"visits":visits_serializer.data},status=200) 

@csrf_exempt
def getTSNE(request): 
    if request.method == 'GET':       
          
        if TSNEImg.objects.first() is not None and TSNEImg.objects.first().isUpdated is True:
            tsne_serializer = TSNESerializer(TSNEImg.objects.first())
            return JsonResponse({"status": {"success": True,"message": "Successfully fetched"},"tsne": tsne_serializer.data},status=200) 
         

        visits = Visit.objects.all() 
        vlist = list(visits.values())
        
        visit_serializer = VisitSerializer(vlist,many=True)
        df = pd.DataFrame(visit_serializer.data)       

        
        id_column = 'PTID'
        date_column = 'VISCODE'
        label_column = 'DX'
        pad_value = 10**5
        selected_months = [0, 6, 12, 18, 24]

        features = ['RAVLT_immediate','ADAS11','ADAS13','MMSE',
        'Hippocampus',
        'WholeBrain',
        'FDG',
        'MidTemp',
        'Entorhinal',
        'Fusiform','ICV',
        'APOE4','Ventricles',"FAQ", "CDRSB","AGE"]    

        features_bl = []
        selected_model = SelectedModel.objects.first().ClassNum
        if selected_model=="8":
            model_path='api/deneme_model_lastt_8.pth'
            s_labels = ["Dementia","Dementia to MCI","MCI","MCI to Dementia","MCI to NL","NL","NL to Dementia","NL to MCI"]
            features_bl = [x + "_bl" for x in features if x not in ['APOE4','M','AGE']]
        elif selected_model=="2":
            model_path='api/deneme_model_upf_2.pth'
            s_labels = ["Dementia","MCI"]
        elif selected_model=="3":
            model_path='api/deneme_model_upf_3.pth'
            s_labels = ["Dementia","MCI","NL"]
        else:
            model_path='api/deneme_model_upf_4.pth'
            s_labels = ["Dementia","MCI to Dementia","NL","NL to MCI"]  

        if selected_model!="8":
            features = ['AGE', 'APOE4', 'CDRSB', 'ADAS11', 'ADAS13', 'MMSE', 'RAVLT_immediate', 'RAVLT_learning', 'RAVLT_forgetting', 'RAVLT_perc_forgetting', 'FAQ', 'Ventricles', 'Hippocampus',
            'WholeBrain', 'Entorhinal', 'Fusiform', 'MidTemp', 'ICV']


        features_list = sorted(features + features_bl)
        cols = [id_column, date_column] + features_list
        data_2d, num_column_list, cat_column_list = data_preprocessing(dc(df), (id_column, date_column, label_column), cols, selected_months, is_2d=True, interpolation=False)
        values = prepare_model_data_2d(data_2d, 0.2, pad_value, num_column_list, selected_labels=s_labels,isTSNE=True)
        values = values.astype(np.float32)

        seed = 0
        torch.manual_seed(seed)
        device = "cuda" if torch.cuda.is_available() else "cpu"

        
        model = torch.load(model_path).to(device)

        with torch.no_grad():
         values = torch.from_numpy(values).to(device)
         pred = model(values)   

       
        """
        u, indices = np.unique(pred.argmax(1).numpy(), return_index=True)
        print("uniqueler")
        print(u)
        """
        

        n_components = 2
        tsne = TSNE(n_components)
        tsne_result = tsne.fit_transform(values)
        
        label_names_tsne = []
        for res in pred.argmax(1).numpy():
            label_names_tsne.append(s_labels[res])


        tsne_result_df = pd.DataFrame({'tsne_1': tsne_result[:,0], 'tsne_2': tsne_result[:,1], 'label': label_names_tsne})
        fig, ax = plt.subplots(1)
        plt.figure(1)
        plt.xticks([i for i in range(-100, 105, 5)])
        plt.yticks([i for i in range(-100, 105, 5)])
        #fig.set_size_inches(9.2, 9.2)
        fig.set_size_inches(13,13)
        sns.scatterplot(x='tsne_1', y='tsne_2', hue='label', data=tsne_result_df, ax=ax,s=60)
        #sns.set(rc={'figure.figsize':(20,5)})
        sns.set(rc={'figure.figsize':(30,5)})
        lim = (tsne_result.min()-5, tsne_result.max()+5)
        ax.set_xlim(lim)
        ax.set_ylim(lim)
        ax.set_aspect('equal')
        ax.set_adjustable("datalim")
        ax.legend(bbox_to_anchor=(1.05, 1), loc=2, borderaxespad=0.0)
        img_name = timestamped_name(selected_model)
        plt.savefig(img_name, dpi=600, bbox_inches='tight', s=50, format="png") 
        plt.close()
 

        with open(img_name,"rb") as imagefile:
            byteform = base64.b64encode(imagefile.read())

        if TSNEImg.objects.first() is None:          
            TSNEImg.objects.create(ID="1",isUpdated=True, ImageBytes=byteform)
        else:
            TSNEImg.objects.filter(ID="1").update(isUpdated=True, ImageBytes=byteform)        

        tsne_serializer = TSNESerializer(TSNEImg.objects.first())

        return JsonResponse({"status": {"success": True,"message": "Successfully fetched"},"tsne": tsne_serializer.data},status=200) 

@csrf_exempt
def getAgeGraphs(request): 
    if request.method == 'GET': 

        if AgeGraphsImg.objects.first() is not None and AgeGraphsImg.objects.first().isUpdated is True:
            agegraphs_serializer = AgeGraphsSerializer(AgeGraphsImg.objects.first())
            return JsonResponse({"status": {"success": True,"message": "Successfully fetched"},"graph": agegraphs_serializer.data},status=200) 

        visits = Visit.objects.all() 
        vlist = list(visits.values())
        whole_brains =[[] for i in range(0,5)]
        hippocampuses =[[] for i in range(0,5)]
        entorhinals =[[] for i in range(0,5)]
        fusiforms =[[] for i in range(0,5)]
        wholebrain_means = []
        hippocampus_means = []
        entorhinal_means = []
        fusiform_means = []
        for visit in vlist:
            if float(visit['AGE'])<50:
                continue
            age_group = int(math.floor(float(visit['AGE'])/10)) 
            if visit["WholeBrain"] is not None:
                whole_brains[age_group-5].append(float(visit["WholeBrain"]))
            if visit["Hippocampus"] is not None:
                hippocampuses[age_group-5].append(float(visit["Hippocampus"]))   
            if visit["Entorhinal"] is not None:
                entorhinals[age_group-5].append(float(visit["Entorhinal"]))    
            if visit["Fusiform"] is not None:
                fusiforms[age_group-5].append(float(visit["Fusiform"]))      

        for wb in whole_brains:
            if len(wb)==0:
                wholebrain_means.append(0)
            else:
                wholebrain_means.append(float(sum(wb)/len(wb)))
        for h in hippocampuses:        
            if len(h)==0:
                hippocampus_means.append(0)
            else:
                hippocampus_means.append(float(sum(h)/len(h)))
        for e in entorhinals:        
            if len(e)==0:
                entorhinal_means.append(0)
            else:
                entorhinal_means.append(float(sum(e)/len(e)))
        for f in fusiforms:        
            if len(f)==0:
                fusiform_means.append(0)
            else:  
                fusiform_means.append(float(sum(f)/len(f)))
      

        age_labels = ["50-60","60-70","70-80","80-90","90+"]
        font = {'family' : 'Calibri', 'size'   : 9}
        plt.rc('font', **font)

        plt.subplot(2, 2, 1)
        plt.subplots_adjust(left=0.1,
                    bottom=0.1, 
                    right=0.9, 
                    top=0.9, 
                    wspace=0.4, 
                    hspace=0.4)
        plt.bar(age_labels,wholebrain_means, color=(0.2, 0.4, 0.6, 0.6))
        plt.xlabel('Age')
        plt.ylabel('Whole Brain Size')

        plt.subplot(2, 2, 2)
        plt.bar(age_labels,hippocampus_means, color=(0.2, 0.4, 0.6, 0.6))
        plt.xlabel('Age')
        plt.ylabel('Hippocampus Size')

        plt.subplot(2, 2, 3)
        plt.bar(age_labels,entorhinal_means, color=(0.2, 0.4, 0.6, 0.6))
        plt.xlabel('Age')
        plt.ylabel('Entorhinal Size')

        plt.subplot(2, 2, 4)
        plt.bar(age_labels,fusiform_means, color=(0.2, 0.4, 0.6, 0.6))
        plt.xlabel('Age')
        plt.ylabel('Fusiform Size')

        plt.savefig("bars.png", dpi=300, bbox_inches='tight', format="png")
        plt.close()

        with open("bars.png","rb") as imagefile:
            byteform = base64.b64encode(imagefile.read())

        if AgeGraphsImg.objects.first() is None:            
            AgeGraphsImg.objects.create(ID="1",isUpdated=True, ImageBytes=byteform)
        else:
            AgeGraphsImg.objects.filter(ID="1").update(isUpdated=True, ImageBytes=byteform) 

        agegraphs_serializer = AgeGraphsSerializer(AgeGraphsImg.objects.first())

        return JsonResponse({"status": {"success": True,"message": "Successfully fetched"},"graph": agegraphs_serializer.data},status=200) 




