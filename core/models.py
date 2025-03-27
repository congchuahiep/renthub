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
    # Loại người dùng
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
        

class Utilities(BaseModel):
    '''
    Model này dùng để hỗ trợ cho Model RentalPost,
    thêm các thông tin về tiện ích cho căn phòng
    của bài đăng cho thuê nhà
    '''
    name = models.CharField(max_length=256)
    
        
class Post(BaseModel):
    
    STATUS = {
        "pending": "Đang kiểm duyệt",
        "approved": "Đã kiểm duyệt",
        "rejected": "Từ chối kiểm duyệt",
        "expired": "Hết hạn",
        "rented": "Đã thuê"
    }
    
    title = models.CharField(max_length=256)
    content = models.TextField(null = True)
    status = models.CharField()
    

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
