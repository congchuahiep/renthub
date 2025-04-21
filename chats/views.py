from rest_framework import generics, viewsets
from chats import serializers
from chats.models import Conversation, Message
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class ConversationViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Conversation.objects.filter(active=True)
    serializer_class = serializers.ConversationSerializer

    @action(methods=['post'],detail=True, url_path='conversation_post')
    def create_conversation(self, request,id):
        try:
            user2 = User.objects.get(pk=id)
        except User.DoesNotExist:
            return Response({"error": f"User with id {id} not found"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = serializers.ConversationSerializer(
            data={},
            context={'request':request,'user2':user2}
        )
        serializer.is_valid(raise_exception=True)
        conversation= serializer.save()
        return Response(serializers.ConversationSerializer(conversation, context={'request': request}).data,status=status.HTTP_201_CREATED)
    @action(detail=False, methods=['get'], url_path='conversation_get')
    def get_conversations(self, request):
        """Lấy danh sách cuộc trò chuyện của user hiện tại."""
        user = request.user
        conversations = Conversation.objects.filter(Q(landlord=user) | Q(tenent=user))
        serializer = serializers.ConversationSerializer(conversations, many=True,context={'request': request})
        return Response(serializer.data)

class MessageViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Message.objects.all()
    serializer_class = serializers.MessageSerializer

    @action(methods=['get', 'post'], detail=True, url_path='message')
    def get_message(self,request,id):
        if request.method == 'GET':
            try:
                conversation = Conversation.objects.get(pk=id)
            except Conversation.DoesNotExist:
                return Response({"error": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)

            messages = Message.objects.filter(conversation=conversation)
            serializer = serializers.MessageSerializer(messages, many=True)
            return Response(serializer.data)

    def create_message(self, request, id):
        if request.method == 'POST':
            sender_id = request.data.get("sender")
            try:
                sender = User.objects.get(pk=sender_id)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = serializers.MessageSerializer(data={
                "content": request.data.get("content"),
                "conversation": id,
                "sender": sender.pk,
                "active": True
            }, context={'request': request})

            serializer.is_valid(raise_exception=True)
            message = serializer.save()

            return Response(serializers.MessageSerializer(message).data, status=status.HTTP_201_CREATED)

        messages = Message.objects.filter(conversation_id=id, active=True).select_related('sender')
        serializer = serializers.MessageSerializer(messages, many=True)
        return Response(serializer.data)
