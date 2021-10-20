from django.db import models

# Create your models here.
class User(models.Model):
    UserId = models.CharField(primary_key=True, max_length=11)
    Password = models.CharField(max_length=10)