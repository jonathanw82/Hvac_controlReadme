from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("info/", views.info, name="info"),
    path("userAdmin/", views.userAdmin, name="userAdmin"),
    path("login/", views.login, name="login"),
    path("mqttinfo/", views.mqttinfo, name="mqttinfo"),
]
