from rest_framework import serializers
from api.models import Doctor, Patient, Visits, Statistics

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Doctor
        fields=('DoctorId','Password', 'Name', 'Surname', 'Mail')

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model=Patient
        fields=('PTID','AGE','PTGENDER','PTEDUCAT','PTETHCAT','PTRACCAT','PTMARRY','APOE4','DX_bl','DX','EXAMDATE')     


class VisitsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Visits
        fields=('RID','PTID','VISCODE','SITE','D1',
        'D2','COLPROT','ORIGPROT','EXAMDATE','DX_bl',
        'DXCHANGE','AGE','PTGENDER','PTEDUCAT','PTETHCAT',
        'PTRACCAT','PTMARRY','APOE4','FDG','CDRSB','ADAS11',
        'ADAS13','MMSE','RAVLT_immediate','RAVLT_learning','RAVLT_forgetting',
        'RAVLT_perc_forgetting','FAQ','Ventricles','Hippocampus','WholeBrain',
        'Entorhinal','Fusiform','MidTemp','ICV','DX',
        'EXAMDATE_bl','CDRSB_bl','ADAS11_bl','ADAS13_bl','MMSE_bl',
        'RAVLT_immediate_bl','RAVLT_learning_bl','RAVLT_forgetting_bl','RAVLT_perc_forgetting_bl','FAQ_bl',
        'Ventricles_bl','Hippocampus_bl','WholeBrain_bl','Entorhinal_bl','Fusiform_bl',
        'MidTemp_bl','ICV_bl','Years_bl','Month_bl','Month','M','update_stamp')      

class StatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Statistics
        fields=('AvgAge','FemalePercentage','MarriedPercentage_m','DivorcedPercentage_m','NeverMarriedPercentage_m',
        'UnknownPercentage_m','WidowedPercentage_m','WhitePercentage_race','AsianPercentage_race','BlackPercentage_race',
        'UnknownPercentage_race','HawaiianPercentage_race','AmIndianAlaskanPercentage_race','MoreThanOnePercentage_race')            

            