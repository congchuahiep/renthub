from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework import serializers
from core.models import (
    RentalPost,
    RoomSeekingPost,
    Conversation,
    Message,
    CommentPost,
    BoardingHouse,
    Utilities,
    User
)

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'avatar']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = instance.avatar.url
        return data

    def create(self, validated_data):
        data = validated_data.copy()
        u = User(**data)
        u.set_password(u.password)
        u.save()

        return u


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


class RentalPostSerializer(ModelWithImageSerializer):
    class meta:
        utilities = serializers.PrimaryKeyRelatedField(queryset=Utilities.objects.all(), many=True)
        fields = ["id","landlord","active","created_date","province"
                  ,"city","address","price","limit_person"
                  ,"number_of_bedrooms","number_of_bathrooms"
                  ,"utilities"]
    def create(self, validated_data):
        landlord = validated_data.get("landlord")
        

