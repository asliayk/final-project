from rest_framework import serializers
from api.models import Doctor, Patient, Visit

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Doctor
        fields=('DoctorId','Password', 'Name', 'Surname', 'Mail')

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model=Patient
        fields=('PatientId','Name','Surname','Age','Sex','Mail','Job','MaritalStatus','DoctorId','LastDiagnosis','LastScore')     

class VisitSerializer(serializers.ModelSerializer):
    class Meta:
        model=Visit
        fields=('VisitId','Diagnosis','Score','Date','PatientId')           