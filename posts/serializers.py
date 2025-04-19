"""
# TỔ CHỨC CÁCH VIẾT SERIALIZER
    Các serializer ở đây mình sẽ viết theo trật tự thực hiện của các chức năng:
    -> Các trường Serializer
    -> Phương thức to_representation()
    -> Class Meta
    -> Các trường bổ sung
    -> Các phương thức validate
    -> Các phương thức bổ sung
    -> Ghi đè create/update
"""

from rest_framework import serializers

from accounts.serializers import UserSerializer
from posts.models import Post, RentalPost, RoomSeekingPost, Utilities
from utils.models import Image
from utils.serializers import ImageSerializer


class UtilitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilities
        fields = ['id', 'name']


class PostSerializer(serializers.ModelSerializer):
    """
    Base serializer cho việc hiển thị post
    """
    images = ImageSerializer(many=True, read_only=True)

    # Trường để upload ảnh
    upload_images = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Post
        fields = ['title', 'content', 'status', 'created_date', 'images', 'upload_images']


class PostCreateSerializer(serializers.ModelSerializer):
    """
    Base serializer cho việc tạo post
    """

    # Các trường Serializer
    title = serializers.CharField(write_only=True)
    content = serializers.CharField(write_only=True)
    upload_images = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    # Các phương thức Validate
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

    # Các phương thức bổ sung
    def create_post(self, validated_data, post_type):
        """
        Method chung để tạo Post và xử lý ảnh
        """
        # Tách dữ liệu của Post và ảnh
        title = validated_data.pop('title')
        content = validated_data.pop('content')
        upload_images = validated_data.pop('upload_images', [])

        # Tạo Post
        post = Post.objects.create(
            title=title,
            content=content,
            post_type=post_type
        )

        # Xử lý ảnh
        for image_file in upload_images:
            image = Image.objects.create(
                image=image_file,
                alt=f"Image for {post.title}"
            )
            post.images.add(image)

        return post


class RentalPostSerializer(serializers.ModelSerializer):
    """
    Serializer cho việc hiển thị RentalPost
    """

    # Các trường serializer
    landlord = UserSerializer(read_only=True)
    utilities = UtilitiesSerializer(many=True, read_only=True)
    post = PostSerializer(read_only=True)

    class Meta:
        model = RentalPost
        fields = [
            'post',
            'landlord', 'province', 'city', 'address', 'price',  # RentalPost fields
            'area', 'number_of_bedrooms', 'number_of_bathrooms', 'utilities'
        ]
        read_only_fields = ['landlord', 'created_at', 'updated_at', 'status']


class RentalPostCreateSerializer(PostCreateSerializer):

    def to_representation(self, instance):
        """
        Sau khi thực hiện phương thức HTTP POST hoàn tất
        ta trả về phản hồi cho client thông qua RentalPostSerializer
        """
        # Sử dụng RentalPostSerializer để serialize kết quả
        return RentalPostSerializer(instance).data

    class Meta:
        model = RentalPost
        fields = [
            'title', 'content', 'upload_images',  # Post fields
            'province', 'city', 'address', 'price',  # RentalPost fields
            'area', 'number_of_bedrooms', 'number_of_bathrooms', 'utilities'
        ]

    # Ghi đè phương thức create()
    def create(self, validated_data):
        """
        Khi tạo một RentalPost
        nó sẽ tạo ra một Post mới và RentalPost sẽ dùng khoá
        chính của nó trỏ quan hệ 1-1 tới Post.

        Ngoài ra, trong Django ta không thể gán trực tiếp
        giá trị cho trường many-to-many (ở đây là `utilities`).
        Nên ta phải thêm `ultilites` thủ công bằng:
        ```python
        rental_post.utilities.set(utilities)
        ```
        """
        # Tách dữ liệu utilities ra khỏi validated_data
        utilities = validated_data.pop('utilities', [])

        # Tạo Post
        post = self.create_post(validated_data, Post.PostType.RENTAL)

        # Tạo RentalPost (không bao gồm utilities)
        rental_post = RentalPost.objects.create(post=post, **validated_data)

        # Thêm utilities sau khi đã tạo rental_post
        if utilities:
            rental_post.utilities.set(utilities)

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
