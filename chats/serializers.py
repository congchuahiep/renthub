from rest_framework.serializers import ModelSerializer
from chats.models import Conversation, Message
from datetime import datetime

class ConversationSerializer(ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['id', 'landlord', 'tenent']

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
class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['sender'] = {
            'id': instance.sender.id,
            'username': instance.sender.username,
        }
        data['create_at'] = datetime.strftime(instance.create_at, "%Y-%m-%d %H:%M:%S")

        return data
    

    