from logging import Logger

import cloudinary
from cloudinary import uploader
from cloudinary.models import CloudinaryField
from django.db import models
from django.utils.safestring import mark_safe


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Image(BaseModel):
    image = CloudinaryField(null=False)
    alt = models.CharField(max_length=256, blank=True, null=True)

    def __str__(self):
        return f"{self.image.public_id}"

    def delete(self, *args, **kwargs):
        """
        Xóa ảnh trên Cloudinary trước khi xóa record
        """
        if self.image.public_id:
            uploader.destroy(self.image.public_id)
        super().delete(*args, **kwargs)

    def get_url(self, transformations=""):
        '''
        Tạo URL cho ảnh cloudinary
        :param transformations: Các biến đổi ảnh
        :return: URL ảnh
        '''
        url = cloudinary.utils.cloudinary_url(
            self.image.public_id,
            cloud_name=cloudinary.config().cloud_name,  # Lấy cloud_name từ config
            secure=True,  # Đảm bảo HTTPS
            transformation=transformations
        )[0]
        return url

    def get_image_element(self, transformations=""):
        '''
        Hiển thị ảnh từ cloudinary
        :param transformations: Các biến đổi ảnh
        :return: Ảnh
        '''
        image_url = self.get_url(transformations)

        return mark_safe(f"<img src='{image_url}' />")


class ImageManagement(models.Model):
    images = models.ManyToManyField(
        'utils.Image',
        blank=True,
        related_name="%(class)s"
    )

    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        """
        Xóa ảnh trên Cloudinary trước khi xóa record
        """
        try:
            # Lưu danh sách images trước khi xóa object
            images_to_delete = list(self.images.all())

            # Xóa object trước
            super().delete(*args, **kwargs)

            # Sau đó xóa tất cả images liên quan
            for image in images_to_delete:
                try:
                    image.delete()
                except Exception as e:
                    Logger.error(f"Error deleting image {image.id}: {str(e)}")

        except Exception as e:
            Logger.error(f"Error in delete process: {str(e)}")
            raise
