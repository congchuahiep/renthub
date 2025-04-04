from django.shortcuts import render
from core import serializers
from rest_framework import viewsets, generics
from core.models import RentalPost, RoomSeekingPost, CommentPost, Utilities,  Conversation, Message, BoardingHouse

class RentialPostViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = RentalPost.objects.filter(avtive = True)
    serializer_class = serializers.RentalPostSerializer
