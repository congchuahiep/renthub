from django.urls import path, include
from rest_framework import routers

# register url route
router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
]
