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
    AGE = models.CharField(max_length=30)
    PTGENDER = models.CharField(max_length=30)
    PTEDUCAT = models.CharField(max_length=30)
    PTETHCAT = models.CharField(max_length=50)
    PTRACCAT = models.CharField(max_length=50)
    PTMARRY = models.CharField(max_length=50)
    APOE4 = models.CharField(max_length=30)
    DX_bl = models.CharField(max_length=30)
    DX = models.CharField(max_length=30)
    EXAMDATE = models.CharField(max_length=50)


class Visit(models.Model):    
    RID = models.CharField(max_length=30)
    PTID = models.CharField(max_length=30)
    VISCODE = models.CharField(max_length=30)
    SITE = models.CharField(max_length=30)
    D1 =  models.CharField(max_length=30)
    D2 = models.CharField(max_length=30)
    COLPROT =  models.CharField(max_length=30)
    ORIGPROT =  models.CharField(max_length=30)
    EXAMDATE =  models.CharField(max_length=30)
    DX_bl =  models.CharField(max_length=30)
    DXCHANGE =  models.CharField(max_length=30)
    AGE =  models.CharField(max_length=30)
    PTGENDER =  models.CharField(max_length=30)
    PTEDUCAT =  models.CharField(max_length=30)
    PTETHCAT =  models.CharField(max_length=30)
    PTRACCAT =  models.CharField(max_length=30)
    PTMARRY =  models.CharField(max_length=30)
    APOE4 = models.CharField(max_length=30)
    FDG = models.CharField(max_length=30)
    CDRSB = models.CharField(max_length=30)
    ADAS11 =  models.CharField(max_length=30)
    ADAS13 =  models.CharField(max_length=30)
    MMSE =  models.CharField(max_length=30)
    RAVLT_immediate =  models.CharField(max_length=30)
    RAVLT_learning = models.CharField(max_length=30)
    RAVLT_forgetting =  models.CharField(max_length=30)
    RAVLT_perc_forgetting = models.CharField(max_length=30)
    FAQ = models.CharField(max_length=30)
    Ventricles =  models.CharField(max_length=30)
    Hippocampus =  models.CharField(max_length=30)
    WholeBrain =  models.CharField(max_length=30)
    Entorhinal =  models.CharField(max_length=30)
    Fusiform =  models.CharField(max_length=30)
    MidTemp =  models.CharField(max_length=30)
    ICV =  models.CharField(max_length=30)
    DX =  models.CharField(max_length=30)
    EXAMDATE_bl =  models.CharField(max_length=30)
    CDRSB_bl =  models.CharField(max_length=30)
    ADAS11_bl = models.CharField(max_length=30)
    ADAS13_bl =  models.CharField(max_length=30)
    MMSE_bl = models.CharField(max_length=30)
    RAVLT_immediate_bl = models.CharField(max_length=30)
    RAVLT_learning_bl = models.CharField(max_length=30)
    RAVLT_forgetting_bl = models.CharField(max_length=30)
    RAVLT_perc_forgetting_bl = models.CharField(max_length=30)
    FAQ_bl = models.CharField(max_length=30)
    Ventricles_bl =  models.CharField(max_length=30)
    Hippocampus_bl =  models.CharField(max_length=30)
    WholeBrain_bl =  models.CharField(max_length=30)
    Entorhinal_bl = models.CharField(max_length=30)
    Fusiform_bl = models.CharField(max_length=30)
    MidTemp_bl =  models.CharField(max_length=30)
    ICV_bl =  models.CharField(max_length=30)
    Years_bl =  models.CharField(max_length=30)
    Month_bl = models.CharField(max_length=30)
    Month =  models.CharField(max_length=30)
    M = models.CharField(max_length=30)
    update_stamp =  models.CharField(max_length=50)
    FDG_bl =  models.CharField(max_length=30)







