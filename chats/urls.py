from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
# router.register(r"chats", views.ChatViewSet,basename="chat")


urlpatterns = [
    path('',include(router.urls))

]