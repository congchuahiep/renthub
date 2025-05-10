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
from utils.serializers import ImageSerializer


class UtilitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilities
        fields = ["id", "name"]


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
    - `post`: Khoá chính và các quan hệ của bài đăng (chỉ đọc).
    - `landlord`: Thông tin của landlord (chỉ đọc).
    - `utilities`: Danh sách tiện ích liên quan (chỉ đọc).
    - `created_date`, `updated_date`: Ngày tạo và cập nhật bài đăng (chỉ đọc).

    Deserialize
    -----------
    - `upload_images`: Danh sách ảnh được upload (chỉ ghi).
    - Các trường khác như `title`, `content`, `price`, `area`,... để tạo hoặc cập nhật bài đăng.

    Validation
    ----------
    - Giới hạn số lượng ảnh upload (tối đa 10 ảnh).
    - Giới hạn kích thước ảnh (tối đa 10MB).
    - Chỉ chấp nhận định dạng ảnh: jpg, jpeg, png.
    """

    # Serialize lồng
    post = PostReferenceSerializer(read_only=True)
    landlord = UserSerializer(read_only=True)
    utilities = UtilitiesSerializer(many=True, read_only=True)

    # Trường để upload ảnh
    upload_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
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
            "landlord",
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
            "property",
            "upload_images",
        ]
        read_only_fields = ["landlord", "created_at", "updated_at", "status"]

    def validate_upload_images(self, value):
        """
        Validate cho trường upload_images.
        Method này tự động được gọi khi validate field upload_images
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
        # Lấy và xoá ảnh ra từ validated_data
        upload_images = validated_data.pop("upload_images", [])

        # Tạo Post base trước
        post = PostReference.objects.create()

        # Tạo RentalPost với post reference, nhưng rental post này chưa có ảnh
        print("validated_data:", validated_data)  # Add this line
        rental_post = RentalPost.objects.create(post=post, **validated_data)

        # Xử lý từng ảnh được upload
        for image_file in upload_images:
            ImagePost.objects.create(
                image=image_file, alt=f"Image for {rental_post.title}", post=post
            )

        return rental_post


class RoomSeekingPostSerializer(serializers.ModelSerializer):
    tenent = UserSerializer(read_only=True)

    class Meta:
        model = RoomSeekingPost
        fields = [
            "id",
            "tenent",
            "title",
            "content",
            "status",
            "position",
            "area",
            "limit_person",
            "created_date",
            "updated_date",
        ]
        read_only_fields = ["tenent", "created_date", "updated_date", "status"]


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