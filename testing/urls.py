from django.urls import include, path
from rest_framework.routers import DefaultRouter
from testing import views  # Import ViewSet

router = DefaultRouter()

# Register the viewsets with the router

urlpatterns = [
    path('', include(router.urls)),
    path('protected/', views.ProtectedView.as_view(), name='protected'),
]
