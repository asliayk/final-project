from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from api.models import Doctor, Patient
from api.serializers import DoctorSerializer, PatientSerializer


# Create your views here.
@csrf_exempt
def getDoctors(request):
    if request.method == 'GET':
        doctors = Doctor.objects.all()
        doctor_serializer = DoctorSerializer(doctors,many=True)
        return JsonResponse({"doctors": doctor_serializer.data},status=200) 

@csrf_exempt
def getPatients(request):
    if request.method == 'GET':
        patients = Patient.objects.all()
        patient_serializer = PatientSerializer(patients,many=True)
        return JsonResponse({"patients": patient_serializer.data},status=200)     

@csrf_exempt
def getPatientsofDoctor(request,num):
    if request.method == 'GET':
        patients = Patient.objects.filter(DoctorId=num)
        patient_serializer = PatientSerializer(patients,many=True)
        return JsonResponse({"patients": patient_serializer.data},status=200)     

@csrf_exempt
def addDoctor(request):
    if request.method == 'POST':
        doctor_data = JSONParser().parse(request)
        doctor_serializer = DoctorSerializer(data=doctor_data)
        if doctor_serializer.is_valid():
            doctor_serializer.save()
            return JsonResponse({"message": "Doctor is added successfully"},status=200)   
        return JsonResponse({"message": "Doctor couldn't be added"},status=400) 

@csrf_exempt
def addPatient(request):
    if request.method == 'POST':
        patient_data = JSONParser().parse(request)
        patient_serializer = PatientSerializer(data=patient_data)
        if patient_serializer.is_valid():
            patient_serializer.save()
            return JsonResponse({"message": "Patient is added successfully"},status=200)  
        return JsonResponse({"message": "Patient couldn't be added"},status=400)         

@csrf_exempt
def loginDoctor(request):
    if request.method == 'POST':
        doctor_data = JSONParser().parse(request)
        if Doctor.objects.filter(DoctorId=doctor_data['DoctorId']).first() is None:
            return JsonResponse({'message': "There is no doctor with that id"},status=400)   
        doctor = Doctor.objects.filter(DoctorId=doctor_data['DoctorId'], Password=doctor_data['Password']).first()
        if doctor is None:
            return JsonResponse({'message': "Wrong password"},status=400)          
        return JsonResponse({'message': "Successfully logged in"}, status=200)

@csrf_exempt
def updateDoctor(request):  
    if request.method == 'PUT':
        doctor_data = JSONParser().parse(request)
        doctor = Doctor.objects.get(DoctorId=doctor_data['DoctorId'])
        doctor_serializer = DoctorSerializer(doctor,data=doctor_data)
        if doctor_serializer.is_valid():
            doctor_serializer.save()
            return JsonResponse({"message": "Updated successfully"},status=200)
        return JsonResponse({"message": "Update unsuccessful"},status=400)    

@csrf_exempt
def updatePatient(request):  
    if request.method == 'PUT':
        patient_data = JSONParser().parse(request)
        patient = Patient.objects.get(PatientId=patient_data['PatientId'])
        patient_serializer = PatientSerializer(patient,data=patient_data)
        if patient_serializer.is_valid():
            patient_serializer.save()
            return JsonResponse({"message": "Updated successfully"},status=200)
        return JsonResponse({"message": "Update unsuccessful"},status=400)          

@csrf_exempt
def deleteDoctor(request):   
    if request.method == 'DELETE': 
        doctor_data = JSONParser().parse(request)         
        doctor = Doctor.objects.get(DoctorId=doctor_data['DoctorId'])
        doctor.delete()
        return JsonResponse({"message": "successfully deleted"},status=200)

@csrf_exempt
def deletePatient(request):   
    if request.method == 'DELETE': 
        patient_data = JSONParser().parse(request)         
        patient = Patient.objects.get(PatientId=patient_data['PatientId'])
        patient.delete()
        return JsonResponse({"message": "successfully deleted"},status=200)        

@csrf_exempt
def getDoctorProfile(request,num):  
    if request.method == 'GET': 
        if Doctor.objects.filter(DoctorId=num).first() is None:
            return JsonResponse({"message": "There is no doctor with that id"},status=400)
        doctor = Doctor.objects.filter(DoctorId=num).first()
        doctor_serializer = DoctorSerializer(doctor)
        return JsonResponse({"doctor": doctor_serializer.data},status=200)       

@csrf_exempt
def getPatientProfile(request,num): 
    if request.method == 'GET': 
        if Patient.objects.filter(PatientId=num).first() is None:
            return JsonResponse({"message": "There is no patient with that id"},status=400)
        patient = Patient.objects.filter(PatientId=num).first()
        patient_serializer = PatientSerializer(patient)
        return JsonResponse({"patient": patient_serializer.data},status=200)   


                       
