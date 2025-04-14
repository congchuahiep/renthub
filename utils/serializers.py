from rest_framework import serializers

from utils.image import generate_image_url

from .models import Image

class ImageSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        """
        Ghi đè phương thức to_representation
        để thêm URL của hình ảnh vào dữ liệu trả về.
        """
        data = super().to_representation(instance)
        data['image'] = generate_image_url(instance.image.url) if instance.image else None
        return data

    class Meta:
        model = Image
        fields = '__all__'
