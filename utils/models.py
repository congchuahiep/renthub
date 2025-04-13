from django.db import models
from cloudinary.models import CloudinaryField


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Image(models.Model):
    image = CloudinaryField(null=False)
    alt = models.CharField(max_length=256, blank=True, null=True)

    def __str__(self):
        return f"{self.image.public_id}"


class ImageManagement(models.Model):
    images = models.ManyToManyField('utils.Image', blank=True, related_name="%(class)s")

    class Meta:
        abstract = True
