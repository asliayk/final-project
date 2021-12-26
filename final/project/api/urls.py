from django.urls import path
from api import views

urlpatterns = [
    path("login",views.loginDoctor),
    path("getDoctors",views.getDoctors),
    path("getPatients",views.getPatients),
    path("addDoctor",views.addDoctor),
    path("addPatient",views.addPatient),
    path("addVisit",views.addVisit),
    path("updateDoctor",views.updateDoctor),
    path("updatePatient",views.updatePatient),
    path("deleteDoctor",views.deleteDoctor),
    path("deletePatient",views.deletePatient),
    path("deleteVisit",views.deleteVisit),
    path("doctorProfile/<int:num>/",views.getDoctorProfile),
    path("patientProfile/<str:id>/",views.getPatientProfile),
    path("getVisits",views.getVisits),
    path("getStatistics",views.getStatistics),
    path("getSimilarVisits",views.getSimilarVisits),
    path("getTSNE",views.getTSNE)
]
