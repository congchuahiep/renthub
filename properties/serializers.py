
from rest_framework import serializers

from accounts.serializers import UserSerializer
from properties.models import Property
from utils.serializers import ImageSerializer


class PropertySerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = '__all__'
