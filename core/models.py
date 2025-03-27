from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField

class User(AbstractUser): 
    '''
    Người dùng chung: Chủ trọ và Người thuê trọ
    '''
    # Loại người dùng Enum
    class UserType(models.TextChoices):
        LANDLORD = "LR", "Landlord"
        TENANT = "TN", "Tenant"
        
    # Loại người dùng
    user_type = models.CharField(
        max_length=10,
        choices=UserType,
        default=UserType.TENANT,
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
        

class Utilities(BaseModel):
    '''
    Model này dùng để hỗ trợ cho Model RentalPost,
    thêm các thông tin về tiện ích cho căn phòng
    của bài đăng cho thuê nhà
    '''
    name = models.CharField(max_length=256)
    
        
class Post(BaseModel):
    class Status(models.TextChoices):
        PENDING = "pd", "Đang kiểm duyệt"
        APPROVED = "ap", "Đã kiểm duyệt"
        REJECTED = "rj", "Từ chối kiểm duyệt"
        EXPIRED = "ep", "Hết hạn"
        RENTED = "rt", "Đã thuê"
    
    title = models.CharField(max_length=256)
    content = models.TextField(null = True)
    status = models.CharField(max_length=10, choices=Status, default=Status.PENDING)
    

class RentalPost(Post):
    '''
    Model này định nghĩa một bài đăng cho thuê nhà của
    một chủ thuê
    '''
    province = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    address = models.CharField(max_length=256)
    price = models.FloatField()
    limit_person = models.IntegerField()
    area = models.FloatField()
    number_of_bedrooms = models.IntegerField()
    number_of_bathrooms = models.IntegerField()
    utilities = models.ManyToManyField('Utilities', related_name='rental_posts')
