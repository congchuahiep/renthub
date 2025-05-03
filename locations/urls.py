from django.urls import path
from . import views

urlpatterns = [
    path("districts/", views.get_districts, name="get_districts"),
    path("wards/", views.get_wards, name="get_wards"),
]