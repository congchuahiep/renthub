from rest_framework import serializers

from properties.models import Property, PropertyImage
from utils.serializers import ImageSerializer


class PropertySerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    upload_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=True
    )

    class Meta:
        model = Property
        fields = [
            "id",
            "status",
            "owner",
            "name",
            "province",
            "district",
            "ward",
            "address",
            "upload_images",
            "images",
            "latitude",
            "longitude",
        ]
        extra_kwargs = {
            "status": {
                "read_only": True,
            },
            "owner": {
                "read_only": True,
            },
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["owner"] = {
            "id": instance.owner.id,
            "name": f"{instance.owner.first_name} {instance.owner.last_name}".strip(),
        }

        if instance.province:
            data["province"] = instance.province.full_name
        if instance.district:
            data["district"] = instance.district.full_name
        if instance.ward:
            data["ward"] = instance.ward.full_name

        return data

    def validate(self, attrs):
        request = self.context["request"]
        instance = self.instance  # Lấy instance hiện tại (nếu có)

        # Kiểm tra quyền sở hữu
        if instance and instance.owner != request.user:
            raise serializers.ValidationError(
                "You do not have permission to edit this property."
            )
        return attrs

    def validate_upload_images(self, value):
        if not value:
            return value
        if len(value) < 3:
            raise serializers.ValidationError("Cần tối thiểu 3 bức ảnh về dãy trọ!")
        if len(value) > 10:
            raise serializers.ValidationError("Vượt quá số lượng ảnh! (Tối đa là 10)")
        max_size = 10 * 1024 * 1024
        allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        for image in value:
            if image.size > max_size:
                raise serializers.ValidationError(
                    f"Kích thước ảnh {image.name} vượt quá 10MB"
                )
            if image.content_type not in allowed_types:
                raise serializers.ValidationError(
                    f"File {image.name} không đúng định dạng ảnh"
                )
            return value

    def create(self, validated_data):
        upload_images = validated_data.pop("upload_images", [])

        request = self.context["request"]
        validated_data["owner"] = request.user
        validated_data["status"] = "PENDING"

        property_instance = Property.objects.create(**validated_data)

        for image_file in upload_images:
            PropertyImage.objects.create(
                image=image_file,
                alt=f"Image for {property_instance.name}",
                property=property_instance,
            )

        return property_instance
