from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('list_rental_post', views.RentialPostViewSet, basename='rental_post')

urlpatterns = [
    path('', include(router.urls))
]