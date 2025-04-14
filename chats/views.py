from rest_framework import generics, viewsets
from chats import serializers
from chats.models import Conversation, Message
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from accounts.utils import UserType
from django.db.models import Q

User = get_user_model()

class ConversationViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Conversation.objects.filter(active=True)
    serializer_class = serializers.ConversationSerializer

    @action(methods=['post'],detail=False, url_path='conversation')
    def create_conversation(self, request):
        if request.method == 'POST':
            user1 = request.user
            user2_id = None

            if user1.user_type == 'LR':
                user2_id = request.data.get('tenent')
            else:
                user2_id = request.data.get('landlord')

            if user2_id is None:
                return Response({"error": "user2 is required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user2 = User.objects.get(pk=user2_id)
            except User.DoesNotExist:
                return Response({"error": f"User with id {user2_id} not found"}, status=status.HTTP_400_BAD_REQUEST)

            if user1 == user2:
                return Response({"error": "Cannot create conversation with yourself."}, status=status.HTTP_400_BAD_REQUEST)

            if user1.user_type == 'LR':
                conversation = Conversation.objects.create(landlord=user1, tenent=user2)
            else:
                conversation = Conversation.objects.create(landlord=user2, tenent=user1)

            serializer = serializers.ConversationSerializer(conversation, context={'request': request}) # Truyền request vào context
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    @action(detail=False, methods=['get'])
    def list_conversations(self, request):
        if request.method == 'GET':
            """Lấy danh sách cuộc trò chuyện của user hiện tại."""
            user = request.user
            conversations = Conversation.objects.filter(Q(landlord=user) | Q(tenent=user))
            serializer = serializers.ConversationSerializer(conversations, many=True,context={'request': request})
            return Response(serializer.data)  # Thêm return Response
    
    
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

    def create_message(self, request, pk):
        if request.method == 'POST':
            sender_id = request.data.get("sender")
            try:
                sender = User.objects.get(pk=sender_id)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = serializers.MessageSerializer(data={
                "content": request.data.get("content"),
                "conversation": pk,
                "sender": sender.pk, # Sử dụng sender.pk thay vì request.user.pk
                "active": True
            }, context={'request': request})

            serializer.is_valid(raise_exception=True)
            message = serializer.save()

            return Response(serializers.MessageSerializer(message).data, status=status.HTTP_201_CREATED)

        messages = Message.objects.filter(conversation_id=pk, active=True).select_related('sender')
        serializer = serializers.MessageSerializer(messages, many=True)
        return Response(serializer.data)
    