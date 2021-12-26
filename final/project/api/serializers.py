from rest_framework import serializers
from api.models import Doctor, Patient, Visit, TSNEImg

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Doctor
        fields=('DoctorId','Password', 'Name', 'Surname', 'Mail')

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model=Patient
        fields=('PTID','AGE','PTGENDER','PTEDUCAT','PTETHCAT','PTRACCAT','PTMARRY','APOE4','DX_bl','DX','EXAMDATE')     


class VisitSerializer(serializers.ModelSerializer):
    class Meta:
        model=Visit
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
        'MidTemp_bl','ICV_bl','Years_bl','Month_bl','Month','M','update_stamp','FDG_bl')  

class TSNESerializer(serializers.ModelSerializer):
    class Meta:
        model=TSNEImg
        fields=('ID', 'ImageBytes','isUpdated')            

    

            