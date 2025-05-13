from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer
from chats.models import Conversation, Message
from datetime import datetime

class ConversationSerializer(ModelSerializer):
    class Meta:
        model = Conversation
        fields = '__all__'
        extra_kwargs = {
            'landlord': {'required': False},
            'tenent': {'required': False},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        user = self.context['request'].user
        if user == instance.landlord:
            data['other_user'] = {
                'id': instance.tenent.id,
                'username': instance.tenent.username,
            }
        elif user == instance.tenent:
            data['other_user'] = {
                'id': instance.landlord.id,
                'username': instance.landlord.username,
            }
        else:
            data['other_user'] = None 

        data.pop('landlord') 
        data.pop('tenent') 

        return data

    def validate(self, attrs):
        request = self.context['request']
        user1 = request.user
        user2 = self.context.get('user2')

        if user1==user2:
            raise serializers.ValidationError("Cannot create conversation with yourself.")
        if user1.user_type == user2.user_type:
            raise serializers.ValidationError(f"CanNot create conversation with another {user1.user_type}.")
        
        if Conversation.objects.filter(
            landlord=user1,tenent=user2
        ).exists() or Conversation.objects.filter(
            landlord=user2, tenent=user1
        ).exists():
            raise serializers.ValidationError(f"Conversation between {user1.id} and {user2.id} was exists.")
        
        return attrs
    
    def create(self, validated_data):
        user1 = self.context['request'].user
        user2 = self.context.get('user2')
        if user1.user_type == 'LR':
            return Conversation.objects.create(landlord=user1, tenent=user2)
        else:
            return Conversation.objects.create(landlord=user2,tenent=user1)

class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
        extra_kwargs={
            'sender':{
                'read_only':True
            }
        }
        

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['sender'] = {
            'id': instance.sender.id,
            'name': f"{instance.sender.first_name} {instance.sender.last_name}".strip(),  # Kết hợp first_name và last_name
        }
        data['create_at'] = datetime.strftime(instance.created_date, "%Y-%m-%d %H:%M:%S")

        return data
    
    def validate(self, attrs):
        request = self.context['request']
        sender = request.user
        conversation = attrs.get('conversation') 
        if sender != conversation.landlord and sender != conversation.tenent:
            raise serializers.ValidationError("Sender must be a participant of the conversation.")

        return attrs

    def create(self, validated_data):
        request = self.context['request']
        validated_data['sender'] = request.user 
        return Message.objects.create(**validated_data)


        