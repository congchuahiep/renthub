from django.urls import include, path
from rest_framework.routers import DefaultRouter
from posts import views  # Import ViewSet

router = DefaultRouter()

# Register the viewsets with the router
router.register(r"rentals", viewset=views.RentalPostViewSet, basename="rental")

urlpatterns = [
    path('', include(router.urls)),
]
