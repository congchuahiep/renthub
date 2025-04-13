from rest_framework import generics, viewsets
from chats import serializers
from chats.models import Conversation, Message
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.contrib.auth import get_user_model

User = get_user_model()

class ConversationViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Conversation.objects.filter(active=True)
    serializer_class = serializers.ConversationSerializer

class MessageViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Message.objects.all()
    serializer_class = serializers.MessageSerializer

    @action(methods=['post'], detail=False, url_path='send')
    def send_message(self, request):
        if request.method == 'POST':
            conversation_id = request.data.get("conversation")
            sender_id = request.data.get("sender") # get sender id from body

            try:
                conversation = Conversation.objects.get(pk=conversation_id)
            except Conversation.DoesNotExist:
                return Response({"error": "Conversation not found."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                sender = User.objects.get(pk=sender_id)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = serializers.MessageSerializer(data={
                "content": request.data.get("content"),
                "conversation": conversation.pk,
                "sender": sender.pk, # use sender.pk
                "active": True
            }, context={'request': request})

            serializer.is_valid(raise_exception=True)
            message = serializer.save()

            return Response(serializers.MessageSerializer(message).data, status=status.HTTP_201_CREATED)

        # GET request handling (if needed)
        conversation_id = request.query_params.get('conversation')
        if conversation_id:
            try:
                conversation = Conversation.objects.get(pk=conversation_id)
                messages = Message.objects.filter(conversation_id=conversation.pk, active=True).select_related('sender')
                serializer = serializers.MessageSerializer(messages, many=True)
                return Response(serializer.data)
            except Conversation.DoesNotExist:
                return Response({"error": "Conversation not found."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Conversation ID is required in query parameters for GET request."}, status=status.HTTP_400_BAD_REQUEST)