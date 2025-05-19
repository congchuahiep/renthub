# from rest_framework import generics, viewsets
# from rest_framework.views import APIView
# from chats import serializers
# from chats.models import Conversation, Message
# from accounts.models import User
# from utils.choices import UserType
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.decorators import action
# from django.contrib.auth import get_user_model
# from rest_framework.permissions import IsAuthenticated
# from rest_framework import status
# from firebase_admin import db
# from .firebase.config import *
# from django.db.models import Q
# from datetime import datetime
# import time
# from django.contrib.auth import get_user_model

# User = get_user_model()


# class ChatViewSet(viewsets.GenericViewSet):
#     queryset = Conversation.objects.all()
#     serializer_class = serializers.ConversationSerializer

#     @action(detail=False, methods=['post', 'get'],url_path="chat")
#     def chat(self, request):
#         current_user = request.user

#         # POST: tạo hoặc lấy chat
#         if request.method == 'POST':
#             other_id = request.data.get('other_user_id')
#             if not other_id:
#                 return Response({'error': 'Missing other_user_id'}, status=status.HTTP_400_BAD_REQUEST)

#             try:
#                 other_user = User.objects.get(pk=other_id)
#             except User.DoesNotExist:
#                 return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

#             if current_user.user_type == UserType.LANDLORD:
#                 if other_user.user_type != UserType.TENANT:
#                     return Response({'error': 'Invalid roles'}, status=status.HTTP_400_BAD_REQUEST)
#                 landlord_id = str(current_user.id)
#                 tenant_id   = str(other_user.id)
#             else:
#                 if other_user.user_type != UserType.LANDLORD:
#                     return Response({'error': 'Invalid roles'}, status=status.HTTP_400_BAD_REQUEST)
#                 landlord_id = str(other_user.id)
#                 tenant_id   = str(current_user.id)

#             chats_ref = db.reference('chats')
#             all_chats = chats_ref.get() or {}
#             for key, val in all_chats.items():
#                 parts = val.get('participants', {})
#                 if parts.get('landlord') == landlord_id and parts.get('tenant') == tenant_id:
#                     return Response({'chat_id': key, 'created': False})

#             new_ref = chats_ref.push({
#                 'participants': {'landlord': landlord_id, 'tenant': tenant_id},
#                 'lastMessage': '',
#                 'lastUpdated': ''
#             })
#             return Response({'chat_id': new_ref.key, 'created': True})

#         user_id_str = str(current_user.id)
#         chats_ref   = db.reference('chats')
#         all_chats   = chats_ref.get() or {}
#         user_chats  = []
#         for key, val in all_chats.items():
#             parts = val.get('participants', {})
#             if user_id_str in (parts.get('landlord'), parts.get('tenant')):
#                 user_chats.append({
#                     'chat_id': key,
#                     'participants': parts,
#                     'lastMessage': val.get('lastMessage', ''),
#                     'lastUpdated': val.get('lastUpdated', '')
#                 })

#         return Response(user_chats, status=status.HTTP_200_OK)
#     @action(detail=True, methods=['post','get'], url_path="message")

#     def message(self, request, pk=None):
#         chat_id = pk
#         user_id = str(request.user.id)
#         chat_ref = db.reference(f'chats/{chat_id}')
#         chat_data = chat_ref.get()
#         if not chat_data:
#             return Response({'error': 'Chat not found'}, status=status.HTTP_404_NOT_FOUND)
#         participants = chat_data.get('participants', {})

#         if user_id not in (participants.get('landlord'), participants.get('tenant')):
#             return Response({'error': 'You are not a participant in this chat'}, status=status.HTTP_403_FORBIDDEN)
        

#         if request.method.__eq__("POST"):          
#             message = request.data.get('message')
#             if not message:
#                 return Response({'error': 'Message content required'}, status=status.HTTP_400_BAD_REQUEST)

#             messages_ref = chat_ref.child('messages')
#             new_msg_ref = messages_ref.push({
#                 'sender': user_id,
#                 'content': message,
#                 'timestamp': int(time.time() * 1000)
#             })

#             chat_ref.update({
#                 'lastMessage': message,
#                 'lastUpdated': int(time.time() * 1000)
#             })

#             return Response({'message_id': new_msg_ref.key, 'message': message}, status=status.HTTP_201_CREATED)
#         elif request.method.__eq__("GET"):
#             messages_ref = chat_ref.child('messages')
#             all_messages = messages_ref.get() or {}

#             message_list = [
#                 {
#                     'id': key,
#                     'sender': msg.get('sender'),
#                     'content': msg.get('content'),
#                     'timestamp': msg.get('timestamp')
#                 }
#                 for key, msg in all_messages.items()
#             ]
#             message_list.sort(key=lambda x: x['timestamp'])

#             return Response(message_list, status=status.HTTP_200_OK)
            
