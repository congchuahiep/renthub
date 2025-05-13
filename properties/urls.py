from django.urls import path, include
from properties import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("properties", views.PropertyViewSet, basename="property")

urlpatterns = [path("", include(router.urls))]
