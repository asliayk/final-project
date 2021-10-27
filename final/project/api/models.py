from django.db import models

# Create your models here.
class Doctor(models.Model):
    DoctorId = models.CharField(primary_key=True, max_length=11)
    Password = models.CharField(max_length=10)
    Name = models.CharField(max_length=15)
    Surname = models.CharField(max_length=15)
    Mail = models.EmailField()

class Patient(models.Model):
    PatientId = models.CharField(primary_key=True, max_length=11)
    Name = models.CharField(max_length=15)
    Surname = models.CharField(max_length=15)
    Age = models.IntegerField()
    Sex = models.CharField(max_length=6)
    Mail = models.EmailField()
    Job = models.CharField(max_length=30)
    MaritalStatus = models.CharField(max_length=15)
    DoctorId = models.ForeignKey(Doctor, to_field='DoctorId',on_delete=models.CASCADE)
    LastDiagnosis = models.CharField(max_length=30, default=None)
    LastScore = models.IntegerField(default=-1)

class Visit(models.Model):
    VisitId = models.CharField(primary_key=True, max_length=20)
    Diagnosis = models.CharField(max_length=30)
    Score = models.IntegerField()  
    Date = models.DateTimeField(auto_now_add=True)
    PatientId = models.ForeignKey(Patient, to_field='PatientId',on_delete=models.CASCADE)





