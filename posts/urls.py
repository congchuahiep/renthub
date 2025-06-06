from django.urls import include, path
from rest_framework.routers import DefaultRouter
from posts import views  # Import ViewSet

router = DefaultRouter()

# Register the viewsets with the router
router.register("rentals", viewset=views.RentalPostViewSet, basename="rental")
router.register("roomseekings", viewset=views.RoomSeekingPostViewSet, basename="roomseeking")
router.register("comments", viewset=views.CommentViewSet, basename="comment")
router.register("utilities", viewset=views.UtilitiesViewSet, basename="utility")

urlpatterns = [
    path('', include(router.urls)),
]
