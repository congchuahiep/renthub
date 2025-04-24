from django.urls import path, include
from comments import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("Post",viewset=views.CommentPostView,basename="comments")


urlpatterns = [
    path('', include(router.urls)),
   

]