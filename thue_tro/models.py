from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField

class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-id']

class Post(BaseModel):
    title = models.CharField()
    content = models.TextField(null = True)

class RentalPost(Post):
    province = models.CharField()
    city = models.CharField()
    address = models.CharField()
    price = models.FloatField()
    limit_person = models.IntegerChoices()
    area = models.FloatField()
    number_of_bedrooms = models.IntegerChoices()
    number_of_bathrooms = models.IntegerChoices()
    utilities = models.Choices

    

