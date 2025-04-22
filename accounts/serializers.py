from rest_framework import serializers
from django.contrib.auth import get_user_model

from properties.models import Property
from utils.choices import UserType
from utils.models import Image

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['avatar'] = instance.avatar.url if instance.avatar else ''
        return data

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'password',
            'email',
            'phone_number',
            'cccd',
            'address',
            'district',
            'province',
            'avatar',
            'dob'
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        # Tạo rental post, nhưng rental post này chưa có ảnh
        user = User(**validated_data)
        user.set_password(user.password)
        user.save()

        return user

class LandlordRegistrationSerializer(serializers.ModelSerializer):
    # User information
    avatar = serializers.ImageField(required=False)

    # Property information
    property_name = serializers.CharField()
    property_province = serializers.CharField()
    property_district = serializers.CharField()
    property_address = serializers.CharField()
    property_images = serializers.ListField(
        child=serializers.ImageField(),
        required=False
    )

    class Meta:
        model = User
        fields = [
            'username',
            'password',
            'email',
            'phone_number',
            'cccd',
            'address',
            'district',
            'province',
            'avatar',
            'dob',
            'property_name',
            'property_province',
            'property_district',
            'property_address',
            'property_images'
        ]
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        # Tách dữ liệu thành thông tin user và property
        property_data = {
            'name': validated_data.pop('property_name'),
            'province': validated_data.pop('property_province'),
            'district': validated_data.pop('property_district'),
            'address': validated_data.pop('property_address'),
        }
        property_images = validated_data.pop('property_images', [])

        # Tạo user trước, gọi lên UserSerializer
        user_serializer = UserSerializer(data=validated_data)
        if user_serializer.is_valid():
            user = user_serializer.save(
                is_active=False,  # Tài khoản chưa active cho đến khi property được duyệt
                user_type=UserType.LANDLORD
            )
        else:
            raise serializers.ValidationError(user_serializer.errors)

        # Tạo property
        property = Property.objects.create(
            owner=user,
            **property_data
        )

        # Xử lý images cho property
        for image_file in property_images:
            image = Image.objects.create(
                image=image_file,
                alt=f"Property {property.name}'s image"
            )
            property.images.add(image)

        return {'user': user, 'property': property}
