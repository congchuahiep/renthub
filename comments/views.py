from django.shortcuts import render
from rest_framework import viewsets,generics,status
from .models import Comment, CommentPost
from rest_framework.decorators import action
from posts.models import RentalPost,RoomSeekingPost
from rest_framework.response import Response
from .serializers import CommentSerializer
from comments import serializers
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class CommentPostView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Comment.objects.filter(active=True)
    serializer_class = serializers.CommentSerializer


    @action(methods=['post','get'], detail=True,url_path='comments')
    
    def add_comment(self,request, pk=None):  
        if request.method.__eq__('POST'):
            serializer = CommentSerializer(
            data=request.data,
            context={
                "request": request,
                "post_id": pk,
                "reply_to": request.data.get("reply_to")
            }
            )
            if serializer.is_valid():
                comment = serializer.save()
                return Response(serializer.data)
        elif request.method == 'GET':
            comments = Comment.objects.filter(
                post_id=pk,
                reply_to__isnull=True
            ).select_related("user").prefetch_related("replies__user").order_by("created_date")

            serializer = CommentSerializer(comments, many=True, context={'request': request})
            return Response(serializer.data)

        return Response({"detail": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)