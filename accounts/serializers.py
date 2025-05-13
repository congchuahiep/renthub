from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.models import Follow
from locations.models import District, Province, Ward
from properties.models import Property, PropertyImage
from utils.choices import UserType
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
    - `LandlordRegistrationSerializer`: Đăng ký tài khoản loại chủ nhà
    - `TenantRegistrationSerializer`: Đăng ký tài khoản loại người thuê
    """

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["avatar"] = instance.avatar.url if instance.avatar else ""
        return data

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "password",
            "email",
            "phone_number",
            "cccd",
            "address",
            "district",
            "province",
            "avatar",
            "dob",
        ]
        extra_kwargs = {"password": {"write_only": True}}

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
    avatar = serializers.ImageField(required=False)

    # Property information
    property_name = serializers.CharField()
    property_address = serializers.CharField()
    property_province = serializers.CharField()
    property_district = serializers.CharField()
    property_ward = serializers.CharField()
    property_upload_images = serializers.ListField(
        child=serializers.ImageField(), required=False, write_only=True
    )

    def to_representation(self, instance):
        """
        Định nghĩa cách serialize trả về kết quả. Vì kết quả khi đăng ký
        ta sẽ trả về thông tin của người dùng mới tạo và cả thông tin về
        dãy trọ mà người dùng đã đăng ký (Tức khác với `ModelSerializer`)
        """
        property = instance["property"]
        return {
            "message": "Đăng ký thành công. Tài khoản của bạn sẽ được kích hoạt sau khi dãy trọ được xét duyệt.",
            "user": UserSerializer(instance["user"]).data,
            "property": {
                "name": property.name,
                "address": property.address,
                "images": ImageSerializer(property.images.all(), many=True).data,
            },
        }

    class Meta:
        model = User
        fields = [
            "username",
            "password",
            "email",
            "phone_number",
            "cccd",
            "address",
            "district",
            "province",
            "avatar",
            "dob",
            "property_name",
            "property_address",
            "property_upload_images",
            "property_province",
            "property_district",
            "property_ward",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_property_upload_images(self, value):
        """
        Validate cho trường `property_upload_images`
        Method này tự động được gọi khi validate field `_property_upload_images`
        """
        if not value:
            return value

        # Giới hạn số lượng ảnh
        if len(value) > 10:
            raise serializers.ValidationError("Không thể upload quá 10 ảnh")

        # Giới hạn kích thước mỗi ảnh (10MB)
        max_size = 10 * 1024 * 1024  # 10MB in bytes

        # Kiểm tra định dạng và kích thước cho từng ảnh
        allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        for image in value:
            # Kiểm tra kích thước
            if image.size > max_size:
                raise serializers.ValidationError(
                    f"Kích thước ảnh {image.name} vượt quá 10MB"
                )

            # Kiểm tra định dạng file
            if image.content_type not in allowed_types:
                raise serializers.ValidationError(
                    f"File {image.name} không phải là định dạng ảnh cho phép (jpg, jpeg, png)"
                )

        return value

    def create(self, validated_data):
        # Tách dữ liệu thành thông tin `user` và `property`
        property_data = {
            "name": validated_data.pop("property_name"),
            "address": validated_data.pop("property_address"),
            "province": validated_data.pop("property_province"),
            "district": validated_data.pop("property_district"),
            "ward": validated_data.pop("property_ward"),
        }
        property_upload_images = validated_data.pop("property_upload_images", [])

        # Lấy thông tin `district`, `province`, `ward` từ database
        try:
            property_data["province"] = Province.objects.get(
                code=property_data["province"]
            )
            property_data["district"] = District.objects.get(
                code=property_data["district"]
            )
            property_data["ward"] = Ward.objects.get(code=property_data["ward"])
        except (Province.DoesNotExist, District.DoesNotExist, Ward.DoesNotExist) as e:
            raise serializers.ValidationError(f"Địa chỉ không hợp lệ: {str(e)}")

        # Tạo `user` trước, gọi UserSerializer để tạo sẵn tài khoản người dùng
        user_serializer = UserSerializer(data=validated_data)
        if user_serializer.is_valid():
            user = user_serializer.save(
                is_active=False,  # Tài khoản chưa active cho đến khi `property` được duyệt
                user_type=UserType.LANDLORD,
            )
        else:
            raise serializers.ValidationError(user_serializer.errors)

        # Tạo đối tượng `property`
        property = Property.objects.create(owner=user, **property_data)

        # Xử lý `images` cho đối tượng `property`
        for image_file in property_upload_images:
            PropertyImage.objects.create(
                image=image_file,
                alt=f"Property {property.name}'s image",
                property=property,
            )

        return {"user": user, "property": property}


class FollowSerializer(serializers.ModelSerializer):
    """
    serializer cho theo dõi giữa người tìm trọ và người cho thuê
    người dùng là người tìm trọ sẽ xem được danh sách người cho thuê,
    và họ sẽ được thông báo khi chủ trọ có bài đăng mới qua email, và ngược lại chủ
    trọ chỉ coi được người đang follow chính mình
    """

    class Meta:
        model = Follow
        fields = ["active", "followee"]

    def validate(self, attrs):
        request = self.context["request"]
        follower = request.user
        followee = self.context.get(
            "followee"
        )  # Đúng: Gọi phương thức get() với khóa 'followee'
        if follower.user_type == followee.user_type:
            raise serializers.ValidationError("Người dùng theo dõi không phù hợp.")
        elif follower.user_type == "LR":
            raise serializers.ValidationError("Hành động không hợp lệ.")
        elif Follow.objects.filter(follower=follower, followee=followee).exists():
            raise serializers.ValidationError("Cuộc trò chuyện đã tồn tại. ")

        return attrs

    def create(self, validated_data):
        follower = self.context["request"].user
        followee = self.context.get("followee")
        validated_data["follower"] = follower
        validated_data["followee"] = followee
        follow_instance = super().create(validated_data)

        return follow_instance
