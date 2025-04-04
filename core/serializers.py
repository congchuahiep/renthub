from rest_framework.serializers import ModelSerializer, SerializerMethodField
from core.models import RentalPost, RoomSeekingPost, Conversation, Message, CommentPost, BoardingHouse

class ItemSerializer(ModelSerializer):
    def to_representation(self, instance):
        return super().to_representation(instance)
        if instance.image:
            data['image'] = instance.image.url
        return data
    

class BoardingHouseSerializer(ItemSerializer):
    class meta:
        model = BoardingHouse
        fields = ['id','boarding_house_name','address','image']


class RentalPostSerializer():
    class meta:
        fields = ['']