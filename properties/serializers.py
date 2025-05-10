from rest_framework import serializers

from accounts.serializers import UserSerializer
from properties.models import Property
from utils.serializers import ImageSerializer


class PropertySerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    images = ImageSerializer(many=True, read_only=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Lấy short_name cho province, district, ward
        if instance.province:
            data["province"] = instance.province.full_name
        if instance.district:
            data["district"] = instance.district.full_name
        if instance.ward:
            data["ward"] = instance.ward.full_name

        return data

    class Meta:
        model = Property
        fields = "__all__"
