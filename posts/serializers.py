from rest_framework import serializers

from accounts.serializers import UserSerializer
from posts.models import RentalPost, RoomSeekingPost, Utilities
from utils.models import Image
from utils.serializers import ImageSerializer


class UtilitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilities
        fields = ['id', 'name']


class RentalPostSerializer(serializers.ModelSerializer):
    landlord = UserSerializer(read_only=True)
    utilities = UtilitiesSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, read_only=True)

    # Trường để upload ảnh
    upload_images = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = RentalPost
        fields = [
            'id',
            'landlord',
            'title',
            'content',
            'status',
            'expired_date',
            'price',
            'limit_person',
            'area',
            'number_of_bedrooms',
            'number_of_bathrooms',
            'utilities',
            'created_date',
            'updated_date',
            'images',
            'upload_images'
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

        # Tạo rental post, nhưng rental post này chưa có ảnh
        rental_post = RentalPost.objects.create(**validated_data)

        # Xử lý từng ảnh được upload
        for image_file in upload_images:
            image = Image.objects.create(
                image=image_file,
                alt=f"Image for {rental_post.title}"
            )
            rental_post.images.add(image)

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
