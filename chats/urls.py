from django.urls import path, include
from chats import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("current_user", views.ConversationViewSet,basename="conversations")
router.register("chat", views.MessageViewSet,basename="messages")


urlpatterns = [
    path('',include(router.urls))

]