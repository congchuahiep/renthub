from django.urls import path, include
from chats import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('conversations', views.ConversationViewSet, basename='conversation')
router.register('messages', views.MessageViewSet, basename='message') # Sửa messenges thành messages

urlpatterns = [
    path('', include(router.urls)),
]