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
    DoctorId = models.ForeignKey(Doctor, to_field='DoctorId',on_delete=models.CASCADE)





