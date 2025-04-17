from rest_framework import serializers

from .models import Image

class ImageSerializer(serializers.ModelSerializer):

    def to_representation(self, image_object):
        """
        Ghi đè phương thức to_representation
        để thêm URL của hình ảnh vào dữ liệu trả về.
        """
        data = super().to_representation(image_object)
        data['image'] = image_object.get_url() if image_object.image else None
        return data

    class Meta:
        model = Image
        fields = '__all__'
