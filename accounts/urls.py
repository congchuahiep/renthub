from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views  # Import ViewSet

router = DefaultRouter()

# Register the viewsets with the router
router.register("users", viewset=views.UserViewSet, basename="user")

urlpatterns = [
    path('', include(router.urls)),
]
