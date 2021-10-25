from rest_framework import serializers
from api.models import Doctor, Patient

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Doctor
        fields=('DoctorId','Password', 'Name', 'Surname', 'Mail')

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model=Patient
        fields=('PatientId','Name','Surname','Age','Sex','Mail','DoctorId')        