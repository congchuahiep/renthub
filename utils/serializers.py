from rest_framework.serializers import ModelSerializer, SerializerMethodField
from utils.models import (
    RentalPost,
    RoomSeekingPost,
    Conversation,
    Message,
    CommentPost,
    BoardingHouse,
)


# Change ItemSerializer to ModelWithImageSerializer for more clarify
class ModelWithImageSerializer(ModelSerializer):
    # this function run before serialization time
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # change raw image to cloudinary url
        data["image"] = instance.image.url if instance.image else ""
        return data


class BoardingHouseSerializer(ModelWithImageSerializer):
    class meta:
        model = BoardingHouse
        fields = ["id", "boarding_house_name", "address", "image"]


class RentalPostSerializer:
    class meta:
        fields = [""]
