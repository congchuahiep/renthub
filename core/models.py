from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField

# Create your models here.
class User(AbstractUser):
    avatar = CloudinaryField(null=False)
    phone_number = models.CharField(max_length=10, unique=True, blank=False, null=False)
    cccd = models.CharField(max_length=12, unique=True, blank=True, null=True)
    
    class Meta:
        abstract = True
    

class AdminUser(User):
    '''
    Quản trị
    '''

    class Meta:
        db_table = "admin_user"


class Landlord(User): 
    '''
    Người dùng: Chủ trọ
    '''

    class Meta:
        db_table = "landlord"


class Tenant(User):
    '''
    Người dùng: Người thuê trọ
    '''

    class Meta:
        db_table = "tenant"
    
    
class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        
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

