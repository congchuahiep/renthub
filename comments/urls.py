from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()


urlpatterns = [
    path('Comments/<int:id>/coment/', views.CommentPostView.as_view(
        {'get': 'get_comments', 'post': 'add_comment'})),
   

]