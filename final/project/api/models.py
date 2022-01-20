from django.db import models
import time

def return_timestamped_id():
    prefix = "000"     
    timestamp = str(int(time.time()*10000000))
    default_value = prefix + timestamp
    return(default_value)

# Create your models here.
class Doctor(models.Model):
    DoctorId = models.CharField(primary_key=True, max_length=11)
    Password = models.CharField(max_length=10)
    Name = models.CharField(max_length=15)
    Surname = models.CharField(max_length=15)
    Mail = models.EmailField()

class Patient(models.Model):
    PTID= models.CharField(primary_key=True, max_length=256, default=return_timestamped_id)
    AGE = models.FloatField()
    PTGENDER = models.CharField(max_length=30)
    PTEDUCAT = models.IntegerField()
    PTETHCAT = models.CharField(max_length=50)
    PTRACCAT = models.CharField(max_length=50)
    PTMARRY = models.CharField(max_length=50)
    APOE4 = models.FloatField()
    DX_bl = models.CharField(max_length=30)
    DX = models.CharField(max_length=30)
    EXAMDATE = models.CharField(max_length=50)


class Visit(models.Model):    
    RID = models.CharField(max_length=30)
    PTID = models.CharField(max_length=30)
    VISCODE = models.CharField(max_length=30)
    SITE = models.IntegerField()
    D1 =  models.IntegerField()
    D2 = models.IntegerField()
    COLPROT =  models.CharField(max_length=30)
    ORIGPROT =  models.CharField(max_length=30)
    EXAMDATE =  models.CharField(max_length=30)
    DX_bl =  models.CharField(max_length=30)
    DXCHANGE =  models.IntegerField()
    AGE =  models.FloatField()
    PTGENDER =  models.CharField(max_length=30)
    PTEDUCAT =  models.IntegerField()
    PTETHCAT =  models.CharField(max_length=30)
    PTRACCAT =  models.CharField(max_length=30)
    PTMARRY =  models.CharField(max_length=30)
    APOE4 = models.FloatField()
    FDG = models.FloatField()
    CDRSB = models.FloatField()
    ADAS11 =  models.FloatField()
    ADAS13 =  models.FloatField()
    MMSE =  models.FloatField()
    RAVLT_immediate =  models.FloatField()
    RAVLT_learning = models.FloatField()
    RAVLT_forgetting =  models.FloatField()
    RAVLT_perc_forgetting = models.FloatField()
    FAQ = models.FloatField()
    Ventricles =  models.FloatField()
    Hippocampus =  models.FloatField()
    WholeBrain =  models.FloatField()
    Entorhinal =  models.FloatField()
    Fusiform =  models.FloatField()
    MidTemp =  models.FloatField()
    ICV =  models.FloatField()
    DX =  models.CharField(max_length=30)
    EXAMDATE_bl =  models.CharField(max_length=30)
    CDRSB_bl =  models.FloatField()
    ADAS11_bl = models.FloatField()
    ADAS13_bl =  models.FloatField()
    MMSE_bl = models.FloatField()
    RAVLT_immediate_bl = models.FloatField()
    RAVLT_learning_bl = models.FloatField()
    RAVLT_forgetting_bl = models.FloatField()
    RAVLT_perc_forgetting_bl = models.FloatField()
    FAQ_bl = models.FloatField()
    Ventricles_bl =  models.FloatField()
    Hippocampus_bl =  models.FloatField()
    WholeBrain_bl =  models.FloatField()
    Entorhinal_bl = models.FloatField()
    Fusiform_bl = models.FloatField()
    MidTemp_bl =  models.FloatField()
    ICV_bl =  models.FloatField()
    Years_bl =  models.FloatField()
    Month_bl = models.FloatField()
    Month =  models.FloatField()
    M = models.FloatField()
    update_stamp =  models.CharField(max_length=50)
    FDG_bl =  models.FloatField()

class TSNEImg(models.Model):   
    ID = models.CharField(max_length=2)
    ImageBytes = models.CharField(max_length=5000)
    isUpdated = models.BooleanField()

class AgeGraphsImg(models.Model):   
    ID = models.CharField(max_length=2)
    ImageBytes = models.CharField(max_length=5000)
    isUpdated = models.BooleanField()   

class SelectedModel(models.Model):   
    ID = models.CharField(primary_key=True,max_length=2)
    ClassNum = models.CharField(max_length=2)  







