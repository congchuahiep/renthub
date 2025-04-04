from django.urls import path, include
<<<<<<< HEAD
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('list_rental_post', views.RentialPostViewSet, basename='rental_post')

urlpatterns = [
    path('', include(router.urls))
]
=======
from rest_framework import routers

# register url route
router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
]
>>>>>>> 4b8b28849a63740a2ecb6403cce45ac9594f8985
