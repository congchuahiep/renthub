from rest_framework import serializers
from django.contrib.auth import get_user_model

from properties.models import Property
from utils.choices import UserType
from utils.models import Image
from utils.serializers import ImageSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer này được sử dụng để trả về thông tin của người dùng

    Phương thức `create()` của `UserSerializer` được ghi đè lại để tiện cho việc
    đăng ký tạo tài khoản và đồng thời băm mật khẩu

    Tuy nhiên ta không nên sử dụng trực tiếp `UserSerializer` để đăng ký tài
    khoản, thay vào đó ta nên sử dụng các Serializer chuyên biệt cho việc tạo
    tài khoản:
        - `LandlordRegistrationSerializer` - Đăng ký tài khoản loại chủ nhà
        - `TenantRegistrationSerializer` - Đăng ký tài khoản loại người thuê
    """

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['avatar'] = instance.avatar.url if instance.avatar else ''
        return data

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
            'dob'
        ]
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def __str__(self) -> str:
        return self.username

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)
        user.save()

        return user


class LandlordRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer chuyên biệt cho việc đăng ký tài khoản chủ nhà
    """

    # User information
    avatar = serializers.CharField(required=False)

    # Property information
    property_name = serializers.CharField()
    property_province = serializers.CharField()
    property_district = serializers.CharField()
    property_address = serializers.CharField()
    property_upload_images = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        write_only=True
    )

    def to_representation(self, instance):
        """
        Định nghĩa cách serialize kết quả. Vì kết quả khi đăng ký
        ta sẽ trả về thông tin của người dùng mới tạo và cả thông
        tin về dãy trọ mà người dùng đã đăng ký (Tức khác với `ModelSerializer`)
        """
        property = instance['property']
        return {
            'message': 'Đăng ký thành công. Tài khoản của bạn sẽ được kích hoạt sau khi dãy trọ được xét duyệt.',
            'user': UserSerializer(instance['user']).data,
            'property': {
                'name': property.name,
                'province': property.province,
                'district': property.district,
                'address': property.address,
                'images': ImageSerializer(property.images.all(), many=True).data
            }
        }

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
            'property_upload_images'
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
        property_images = validated_data.pop('property_upload_images', [])

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
