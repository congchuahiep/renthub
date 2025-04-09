from django.db import models
from cloudinary.models import CloudinaryField

from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Image(models.Model):
    image = CloudinaryField(null=False)
    alt = models.CharField(max_length=256, blank=True, null=True)


class ImageRelation(models.Model):
    """
    Model này dùng để quản lý mối quan hệ giữa ảnh và với các loại model khác
    """

    image = models.ForeignKey(
        "Image", on_delete=models.CASCADE, related_name="relations"
    )
    # generic_model là một trường ForeignKey đến ContentType
    # nó chấp nhận mọi loại model trong Django đều có thể làm
    # khoá ngoại cho trường này
    generic_model = models.ForeignKey(ContentType, on_delete=models.CASCADE) # Loại đối tượng

    # object_id là một trường IntegerField, nó lưu trữ ID của đối tượng
    object_id = models.PositiveIntegerField() # ID của đối tượng
    # đối tượng sau khi đã được ánh xạ với generic_model và object_id
    content_object = GenericForeignKey("generic_model", "object_id")

    class Meta:
        db_table = "image_relation"
