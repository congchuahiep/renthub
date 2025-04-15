from django.shortcuts import render
from rest_framework import viewsets,generics,status
from .models import Comment, CommentPost
from rest_framework.decorators import action
from posts.models import Post,RentalPost,RoomSeekingPost
from rest_framework.response import Response
from .serializers import CommentSerializer
from comments import serializers

# Create your views here.

class CommentPostView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Comment.objects.filter(active=True)
    serializer_class = serializers.CommentSerializer

    @action(methods=['post'], detail=True,url_path='add_comment')
    def add_comment(self,request, id):  
        serializer = CommentSerializer(
        data=request.data,
        context={
            "request": request,
            "post_id": id,  # Đây là dòng quan trọng
            "reply_to": request.data.get("reply_to")
        }
        )
        if serializer.is_valid():
            comment = serializer.save()
            return Response(
                CommentSerializer(comment, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    @action(methods=['get'], detail=False, url_path='get_comments')
    def get_comments(self, request, id):
        comments = Comment.objects.filter(
            post_id=id
        ).select_related("user").prefetch_related("replies__user").order_by("created_date")

        serializer = CommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data)
    