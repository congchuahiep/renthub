from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField

class User(AbstractUser): 
    '''
    Người dùng chung: Chủ trọ và Người thuê trọ
    '''
    USER_TYPE_CHOICES = [
        ('landlord', 'Landlord'),
        ('tenant', 'Tenant'),
    ]

    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES,
        default='tenant',
    )
    
    avatar = CloudinaryField(null=False)
    phone_number = models.CharField(max_length=10, unique=True, blank=False, null=False)
    cccd = models.CharField(max_length=12, unique=True, blank=True, null=True)

    class Meta:
        db_table = "user"
    
    
class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        
class Post(BaseModel):
    title = models.CharField(max_length=256)
    content = models.TextField(null = True)

class RentalPost(Post):
    province = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    address = models.CharField(max_length=256)
    price = models.FloatField()
    limit_person = models.IntegerField()
    area = models.FloatField()
    number_of_bedrooms = models.IntegerField()
    number_of_bathrooms = models.IntegerField()
    utilities = models.Choices

