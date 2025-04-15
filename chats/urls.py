from django.urls import path, include
from chats import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()


urlpatterns = [
    path('Chats/<int:id>/message/', views.MessageViewSet.as_view(
        {'get': 'get_message', 'post': 'create_message'})),

    path('Chats/<int:id>',views.ConversationViewSet.as_view({
        'post':'create_conversation'
    }), name='conversation-create'),

    path('Chats/',views.ConversationViewSet.as_view({
        'get':'get_conversations'
    }),name='conversation-list'),

]