from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from api.models import Doctor, Patient, Visits, Statistics
from api.serializers import DoctorSerializer, PatientSerializer, VisitsSerializer, StatisticsSerializer
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE

from sklearn.metrics import roc_auc_score, average_precision_score, plot_roc_curve
from sklearn import metrics
from sklearn.metrics import confusion_matrix

from copy import deepcopy as dc
from sklearn.decomposition import PCA
import math
import torch
from classifier import Classifier


from torch import nn


# Create your views here.
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

def prepare_model_data_2d(dat, test_ratio, pad_value, num_column_list, target_col="DX", selected_labels=None):
    id_column = 'PTID'
    date_column = 'VISCODE'
    #dat = dat[dat[label_column].isin(selected_labels)]
 
    #scaler_x = StandardScaler()
    #scaler_x.fit(dat[num_column_list])

    #dat[num_column_list] = scaler_x.transform(dat[num_column_list])
 
    label_num = dat[target_col].nunique()
    dat = pd.concat([dat.drop(target_col, axis=1), pd.get_dummies(dat[target_col])], axis=1)
 
    patients = np.array(dat.sort_values([id_column, date_column])[id_column].tolist())
    values = np.array(dat.sort_values([id_column, date_column]).iloc[:, 2:-(label_num)].values)
    labels = np.array(dat.sort_values([id_column, date_column]).iloc[:, -(label_num):].values)

    idx = int(len(values) * (1 - test_ratio))

    X_train = np.asarray(values[:idx, :]).astype('float32')
    y_train = np.asarray(labels[:idx, :]).astype('float32')
    pt_train = patients[:idx]
    X_test = np.asarray(values[idx:, :]).astype('float32')
    y_test = np.asarray(labels[idx:, :]).astype('float32')
    pt_test = patients[idx:]
    #return X_train, y_train, pt_train, X_test, y_test, pt_test
    return values

def data_preprocessing(data, columns, features_list, selected_months, is_2d, interpolation):
    id_column, date_column, label_column = columns
    df = data[features_list + [label_column]]
 
    months_list = [0] + [int(x[-2:]) for x in df[date_column].unique() if x != 'bl']
    time_dict = dict(zip(df[date_column].unique(), months_list))
    #num_column_list = sorted([col for col in df.select_dtypes(include=["int", "int64", "float"]).columns if
    #                          col not in [id_column, date_column, label_column]])
    #cat_column_list = sorted([col for col in df.select_dtypes(include=['category', 'object']).columns if
    #                          col not in [id_column, date_column, label_column]])
    num_column_list = ['ADAS11', 'ADAS11_bl', 'ADAS13', 'ADAS13_bl', 'AGE', 'APOE4', 'CDRSB', 'CDRSB_bl', 'Entorhinal', 'Entorhinal_bl', 'FAQ', 'FAQ_bl', 'FDG', 'FDG_bl', 'Fusiform', 'Fusiform_bl', 'Hippocampus', 'Hippocampus_bl', 'ICV', 'ICV_bl', 'MMSE', 'MMSE_bl', 'MidTemp', 'MidTemp_bl', 'RAVLT_immediate', 'RAVLT_immediate_bl', 'Ventricles', 'Ventricles_bl', 'WholeBrain', 'WholeBrain_bl']
  
    
    cat_column_list = []
    df = get_onehot_columns(df, cat_column_list)
   
    df[date_column] = df[date_column].apply(lambda x: time_dict[x])

    if is_2d:
        valid_ids = df.groupby(id_column).nunique().query("{}>3".format(date_column)).index.tolist()
    
    else:
        df = df[df[date_column].isin(selected_months)]
        valid_ids = df.groupby(id_column).nunique().query("{}=={}".format(date_column, len(selected_months))).index.tolist()
    #df = df[df[id_column].isin(valid_ids)]


    df = df.sort_values([id_column, date_column])
   
    if interpolation:
        df[[id_column, date_column] + num_column_list] = df[[id_column, date_column] + num_column_list].groupby(
            id_column).apply(lambda x: x.interpolate())
     
    df = df.groupby(id_column).apply(lambda x: x.fillna(method="ffill"))  # .fillna(method="bfill"))
    # df = df.fillna(df.mean())

   
    for col in num_column_list:
        df[col] = df[col].fillna(df.groupby(label_column)[col].transform('mean'))


    mapping = {k: v for v, k in enumerate(sorted(df[id_column].unique()))}
    df[id_column] = df[id_column].map(mapping)
    # diag = df.groupby(id_column).last().reset_index().query("DX in {}".format(['NL', 'Dementia', 'MCI']))[id_column].tolist()
    # df =  df[df[id_column].isin(diag)]

    #df = df.dropna()
  
    return df, num_column_list, cat_column_list, mapping

@csrf_exempt
def getVisitss(request):
    if request.method == 'GET':
        visitss = Visits.objects.all()
        visits_serializer = VisitsSerializer(visitss,many=True)
        return JsonResponse({"status": {"success": True, "message": "Successfully fetched"},"visits": visits_serializer.data},status=200)

@csrf_exempt
def getStatistics(request):
    if request.method == 'GET':
        statistics = Statistics.objects.all()
        statistics_serializer = StatisticsSerializer(statistics,many=True)
        return JsonResponse({"status": {"success": True, "message": "Successfully fetched"},"statistics": statistics_serializer.data},status=200)         


@csrf_exempt
def getDoctors(request):
    if request.method == 'GET':
        doctors = Doctor.objects.all()
        doctor_serializer = DoctorSerializer(doctors,many=True)
        return JsonResponse({"status": {"success": True, "message": "Successfully fetched"},"doctors": doctor_serializer.data},status=200) 

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
            return JsonResponse({"status": {"success": True, "message": "Patient is added successfully"}},status=200)  
        return JsonResponse({"status": {"success": False, "message": "Patient couldn't be added"}},status=400)         

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
def updatePatient(request):  
    if request.method == 'PUT':
        patient_data = JSONParser().parse(request)
        patient = Patient.objects.get(PatientId=patient_data['PatientId'])
        patient_serializer = PatientSerializer(patient,data=patient_data)
        print(patient)
        if patient_serializer.is_valid():
            patient_serializer.save()
            return JsonResponse({"status": {"success": True,"message": "Updated successfully"}},status=200)
        print(patient_serializer.errors)    
        return JsonResponse({"status": {"success": False,"message": "Update unsuccessful"}},status=400)          

@csrf_exempt
def deleteDoctor(request):   
    if request.method == 'DELETE': 
        doctor_data = JSONParser().parse(request)         
        doctor = Doctor.objects.get(DoctorId=doctor_data['DoctorId'])
        doctor.delete()
        return JsonResponse({"status": {"success": True,"message": "successfully deleted"}},status=200)

@csrf_exempt
def deletePatient(request):   
    if request.method == 'DELETE': 
        patient_data = JSONParser().parse(request)         
        patient = Patient.objects.get(PatientId=patient_data['PatientId'])
        patient.delete()
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
        return JsonResponse({"status": {"success": True, "message": "Successfully fectched"},"doctor": doctor_serializer.data,"patients":patient_serializer.data},status=200)       

@csrf_exempt
def getPatientProfile(request,id): 
    if request.method == 'GET': 
        if Patient.objects.filter(PTID=id).first() is None:
            return JsonResponse({"status": {"success": False,"message": "There is no patient with that id"}},status=400)
        patient = Patient.objects.filter(PTID=id).first()
        patient_serializer = PatientSerializer(patient)
        visits = Visits.objects.filter(PTID=id)
        visit_serializer = VisitsSerializer(visits,many=True)
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

        df['AGE'] = pd.to_numeric(df["AGE"], downcast="float")

        features_bl = [x + "_bl" for x in features if x not in ['APOE4','M','AGE']]

        features_list = sorted(features + features_bl)
        cols = [id_column, date_column] + features_list
        data_2d, num_column_list, cat_column_list, mapping = data_preprocessing(dc(df), (id_column, date_column, label_column), cols, selected_months, is_2d=True, interpolation=False)
        values = prepare_model_data_2d(data_2d, 0.2, pad_value, num_column_list, selected_labels=["Dementia","MCI"])
        values = values.astype(float)

        device = "cuda" if torch.cuda.is_available() else "cpu"
    
        model = torch.load('api/binary_classifier_model.pth').to(device)

        with torch.no_grad():
         values = torch.from_numpy(values).float()
         pred = model(values)
         print(str(pred.argmax(1).numpy()))


        return JsonResponse({"status": {"success": True,"message": "Successfully fetched"},"patient": patient_serializer.data,"visits":visit_serializer.data, "categories":str(pred.argmax(1).numpy())},status=200) 


          

        



                       
