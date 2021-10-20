from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from api.models import User
from api.serializers import UserSerializer


# Create your views here.
@csrf_exempt
def getUsers(request,id=0):
    if request.method == 'GET':
        users = User.objects.all()
        user_serializer = UserSerializer(users,many=True)
        return JsonResponse(user_serializer.data,safe=False) 

@csrf_exempt
def addUser(request,id=0):
    if request.method == 'POST':
        user_data = JSONParser().parse(request)
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse("User is added successfully",safe=False)
        return JsonResponse("User couldn't be added",safe=False) 

@csrf_exempt
def loginUser(request,id=0):
    if request.method == 'POST':
        user_data = JSONParser().parse(request)
        """
        user_serializer = UserSerializer(data=user_data)
        if not user_serializer.is_valid():
            print(user_serializer.errors)
            return JsonResponse("Invalid input",safe=False)
        """    
        user = User.objects.filter(UserId=user_data['UserId'], Password=user_data['Password']).first()
        if user is not None:
            return JsonResponse("User is logged in successfully",safe=False)      
        return JsonResponse("Unsuccessful login",safe=False)          

@csrf_exempt
def updateUser(request,id=0):  
    if request.method == 'PUT':
        user_data = JSONParser().parse(request)
        user = User.objects.get(UserId=user_data['UserId'])
        user_serializer = UserSerializer(user,data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse("Update successfully",safe=False)
        return JsonResponse("Update unsuccessful",safe=False)    

@csrf_exempt
def deleteUser(request,id=0):   
    if request.method == 'DELETE': 
        user_data = JSONParser().parse(request)         
        user = User.objects.get(UserId=user_data['UserId'])
        user.delete()
        return JsonResponse("successfully deleted",safe=False)
