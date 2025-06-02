from properties.models import Property
from properties.serializers import PropertySerializer
from rest_framework import serializers

from accounts.serializers import UserSerializer
from posts.models import (
    Comment,
    ImagePost,
    PostReference,
    RentalPost,
    RoomSeekingPost,
    Utilities,
)
from utils.choices import PropertyStatus
from utils.serializers import ImageSerializer


class UtilitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilities
        fields = ["id", "name", "icon"]


class PostReferenceSerializer(serializers.ModelSerializer):
    """
    Serializer cho `PostReference`. Được sử dụng để tạo một khoá chính cho phép
    các Model khác trỏ vào
    """

    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = PostReference
        fields = "__all__"


class RentalPostSerializer(serializers.ModelSerializer):
    """
    Serializer cho `RentalPost` model

    Serialize
    ---------
    - `post`: Khoá chính và các quan hệ của bài đăng.
    - `owner`: Thông tin của landlord.
    - `utilities`: Danh sách tiện ích liên quan.
    - `created_date`, `updated_date`: Ngày tạo và cập nhật bài đăng.

    Deserialize
    -----------
    - `property_id` : Id của dãy nhà trọ liên quan đến bài đăng
    - `upload_images`: Danh sách ảnh được upload.
    - `utilities_ids`: Danh sách các id utilities đã chọn cho bài đăng.
    - Các trường khác như `title`, `content`, `price`, `area`,... để tạo hoặc cập nhật bài đăng.

    Validation
    ----------
    - Giới hạn số lượng ảnh upload (tối đa 10 ảnh).
    - Giới hạn kích thước ảnh (tối đa 10MB).
    - Chỉ chấp nhận định dạng ảnh: jpg, jpeg, png.
    """

    # Serialize
    post = PostReferenceSerializer(read_only=True)
    owner = UserSerializer(read_only=True)
    utilities = UtilitiesSerializer(many=True, read_only=True)

    # Deserialize
    property_id = serializers.IntegerField(write_only=True, required=True)
    upload_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=True
    )
    utilities_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=True
    )

    def to_representation(self, instance):
        """
        Tuỳ chỉnh quá trình Serialize, Trả thêm thông tin `property`
        """
        data = super().to_representation(instance)
        data["property"] = PropertySerializer(instance.property).data
        return data

    class Meta:
        model = RentalPost
        fields = [
            "post",
            "owner",
            "created_date",
            "updated_date",
            "status",
            "title",
            "content",
            "expired_date",
            "price",
            "limit_person",
            "area",
            "number_of_bedrooms",
            "number_of_bathrooms",
            "utilities",
            "utilities_ids",
            "upload_images",
            "property",
            "property_id",
        ]
        read_only_fields = [
            "owner",
            "created_at",
            "updated_at",
            "expired_date",
            "status",
            "property",
            "utilities",
        ]

    def validate_upload_images(self, value):
        """
        Validate cho trường upload_images:
        - Giới hạn upload ảnh quá 10MB
        - Kiểm tra số lượng (tối đa 10 ảnh)
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

    def validate_property_id(self, value):
        """
        Validate property_id:
        - Kiểm tra property có tồn tại không
        - Kiểm tra property có thuộc sở hữu của user hiện tại không
        - Kiểm tra property đã được approve chưa
        """
        try:
            property = Property.objects.get(id=value)

            # Kiểm tra quyền sở hữu
            request = self.context.get("request")
            if property.owner != request.user:
                raise serializers.ValidationError(
                    "Bạn không có quyền đăng bài cho dãy trọ này"
                )

            # Kiểm tra trạng thái của property
            if property.status != PropertyStatus.APPROVED:
                raise serializers.ValidationError("Dãy trọ này chưa được phê duyệt")

            return value

        except Property.DoesNotExist:
            raise serializers.ValidationError("Không tìm thấy dãy trọ với ID này")

    def validate_utilities_ids(self, value):
        """
        Validate danh sách utilities IDs:
        - Kiểm tra utility có tồn tại hay không tồn tại
        """
        if not value:
            return value

        # Kiểm tra tất cả utilities có tồn tại không
        existing_utilities = Utilities.objects.filter(id__in=value)
        if len(existing_utilities) != len(value):
            found_ids = set(utility.id for utility in existing_utilities)
            invalid_ids = [id for id in value if id not in found_ids]
            raise serializers.ValidationError(
                f"Không tìm thấy tiện ích với ID: {', '.join(map(str, invalid_ids))}"
            )

        return value

    def create(self, validated_data):
        # Lấy và xoá các trường đặc biệt từ validated_data
        upload_images = validated_data.pop("upload_images", [])
        utilities_ids = validated_data.pop("utilities_ids", [])
        property_id = validated_data.pop("property_id")

        # Tạo Post base trước
        post = PostReference.objects.create()

        # Lấy property instance
        property = Property.objects.get(id=property_id)

        # Tạo RentalPost với post reference
        print("validated_data:", validated_data)
        rental_post = RentalPost.objects.create(
            post=post, property=property, **validated_data
        )

        # Thêm utilities cho rental post
        if utilities_ids:
            utilities = Utilities.objects.filter(id__in=utilities_ids)
            rental_post.utilities.add(*utilities)

        # Tải lên hình ảnh và thêm vào rentail post
        for image_file in upload_images:
            ImagePost.objects.create(
                image=image_file, alt=f"Image for {rental_post.title}", post=post
            )

        return rental_post


class RoomSeekingPostSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    post = PostReferenceSerializer(read_only=True)

    class Meta:
        model = RoomSeekingPost
        fields = "__all__"
        extra_kwargs = {
            "owner": {
                "read_only": True,
            },
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["owner"] = {
            "id": instance.owner.id,
            "name": f"{instance.owner.first_name} {instance.owner.last_name}",
            "avatar": instance.owner.avatar,
        }
        return data

    def validate(self, attrs):
        request = self.context["request"]
        instance = self.instance

        if instance and instance.owner != request.user:
            raise serializers.ValidationError(
                "You do not have permission to edit this post."
            )
        return attrs

    def create(self, validated_data):
        validated_data["status"] = "pending"
        post = PostReference.objects.create()
        roomSeeking_post = RoomSeekingPost.objects.create(post=post, **validated_data)

        return roomSeeking_post


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer cho `Comment` model

    Serialize
    ---------
    - `content`: Nội dung của comment
    - `user`: Thông tin người dùng gửi comment (UserSerializer)
    - `created_date`, `updated_date`: Ngày tạo và cập nhật comment (chỉ đọc)

    Deserialize
    -----------
    - `content`: Nội dung của comment
    - `user`: Id của người dùng gửi comment
    - `post`: Id của bài đăng
    """

    def to_representation(self, instance):
        """
        Tuỳ chỉnh quá trình Serialize, Trả về toàn bộ phần thông tin
        của người dùng thông qua UserSerializer
        """
        data = super().to_representation(instance)
        data["user"] = UserSerializer(instance.user).data
        return data

    class Meta:
        model = Comment
        fields = ["id", "content", "created_date", "updated_date", "user", "post"]
        extra_kwargs = {"post": {"write_only": True}}
