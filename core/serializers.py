from rest_framework.serializers import ModelSerializer, SerializerMethodField
from core.models import RentalPost, RoomSeekingPost, Conversation, Message, CommentPost, BoardingHouse

class ItemSerializer(ModelSerializer):
    def to_representation(self, instance):
        return super().to_representation(instance)
  