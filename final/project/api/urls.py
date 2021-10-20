from django.conf.urls import url
from api import views

urlpatterns = [
    url("login",views.loginUser),
    url("getUsers",views.getUsers),
    url("addUser",views.addUser),
    url("updateUser",views.updateUser),
    url("deleteUser",views.deleteUser)
]
