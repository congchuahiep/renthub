from django.urls import path, include
from chats import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('conversations', views.ConversationViewSet, basename='conversation')


urlpatterns = [
    path('Chats/<int:id>/message/', views.MessageViewSet.as_view({'get': 'get_message', 'post': 'create_message'})),
    path('', include(router.urls)),
]