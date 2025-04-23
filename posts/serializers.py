from rest_framework import serializers

from accounts.serializers import UserSerializer
from posts.models import ImagePost, PostReference, RentalPost, RoomSeekingPost, Utilities
from utils.serializers import ImageSerializer


class UtilitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilities
        fields = ['id', 'name']


class PostReferenceSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = PostReference
        fields = '__all__'


class RentalPostSerializer(serializers.ModelSerializer):
    """
    Serializer cho RentalPost model. Phục vụ hầu hết các chức năng
    như tạo, cập nhật, xóa, và lấy thông tin chi tiết của một bài đăng cho thuê.
    """

    # Serialize lồng
    post = PostReferenceSerializer(read_only=True)
    landlord = UserSerializer(read_only=True)
    utilities = UtilitiesSerializer(many=True, read_only=True)

    # Trường để upload ảnh
    upload_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = RentalPost
        fields = [
            'post',
            'landlord',
            'created_date',
            'updated_date',
            'status',
            'title',
            'content',
            'expired_date',
            'price',
            'limit_person',
            'area',
            'number_of_bedrooms',
            'number_of_bathrooms',
            'utilities',
            'upload_images',
        ]
        read_only_fields = ['landlord', 'created_at', 'updated_at', 'status']


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
        allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
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
        upload_images = validated_data.pop('upload_images', [])

        # Tạo Post base trước
        post = PostReference.objects.create()

        # Tạo RentalPost với post reference, nhưng rental post này chưa có ảnh
        rental_post = RentalPost.objects.create(
            post=post,
            **validated_data
        )

        # Xử lý từng ảnh được upload
        for image_file in upload_images:
            ImagePost.objects.create(
                image=image_file,
                alt=f"Image for {rental_post.title}",
                post=post
            )

        return rental_post


class RoomSeekingPostSerializer(serializers.ModelSerializer):
    tenent = UserSerializer(read_only=True)

    class Meta:
        model = RoomSeekingPost
        fields = [
            'id',
            'tenent',
            'title',
            'content',
            'status',
            'position',
            'area',
            'limit_person',
            'created_date',
            'updated_date'
        ]
        read_only_fields = ['tenent', 'created_date', 'updated_date', 'status']
