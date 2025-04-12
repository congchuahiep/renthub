from django.shortcuts import render
from rest_framework import generics, viewsets
from chats import serializers
from chats.models import Conversation, Message

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.filter(active = True)
    serializer_class = serializers.ConversationSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = serializers.MessageSerializer


# Create your views here.
