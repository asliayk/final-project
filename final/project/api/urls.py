from django.urls import path
from api import views

urlpatterns = [
    path("login",views.loginDoctor),
    path("getDoctors",views.getDoctors),
    path("getPatients",views.getPatients),
    path("addDoctor",views.addDoctor),
    path("addPatient",views.addPatient),
    path("updateDoctor",views.updateDoctor),
    path("updatePatient",views.updatePatient),
    path("deleteDoctor",views.deleteDoctor),
    path("deletePatient",views.deletePatient),
    path("doctorProfile/<int:num>/",views.getDoctorProfile),
    path("patientProfile/<int:num>/",views.getPatientProfile),
    path("addVisit",views.addVisit),
    path("deleteVisit",views.deleteVisit),
    path("getVisits",views.getVisits)
]
