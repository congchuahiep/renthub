from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from utils.models import BaseModel
from utils.choices import UserType

# Create your models here.
class User(AbstractUser):
    """
    Model này định nghĩa tài khoản người dùng trong hệ thống. Trong hệ thống gồm hai
    loại tài khoản chỉnh:
    - Landlord
    - Tenant
    
    Fields
    ------
    - `user_type`: Loại người dùng (Landlord/Tenant)
    - `username`: Tên đăng nhập của người dùng
    - `first_name`: Tên của người dùng
    - `last_name`: Họ của người dùng
    - `email`: Email của người dùng
    - `password`: Mật khẩu (đã được băm) của người dùng
    
    *---thông tin khác---*
    - `address`: Địa chỉ của người dùng
    - `district`: Quận của người dùng
    - `province`: Tỉnh của người dùng
    - `dob`: Ngày sinh của người dùng
    - `avatar`: Ảnh đại diện của người dùng
    - `phone_number`: Số điện thoại của người dùngg
    - `cccd`: Số CCCD của người dùng
    """

    # Loại người dùng
    user_type = models.CharField(
        max_length=10,
        choices=UserType,
        default=UserType.TENANT,
    )

    # Nơi ở
    address = models.CharField(max_length=256, blank=True, null=True)
    district = models.CharField(max_length=256, blank=True, null=True)
    province = models.CharField(max_length=256, blank=True, null=True)

    # Các thông tin khác
    dob = models.DateField(blank=True, null=True)
    email = models.EmailField(blank=False, null=False, unique=True)

    # TODO: GIAI ĐOẠN TESTING NÊN MẤY TRƯỜNG NÀY CÓ THỂ BLANK
    avatar = CloudinaryField(null=True, blank=True)
    phone_number = models.CharField(max_length=10, unique=True, blank=True, null=True)
    cccd = models.CharField(max_length=12, unique=True, blank=True, null=True)

    class Meta:
        db_table = "user"



### PROXY MODELS ###

class LandlordApproved(User):
    """
    Người dùng là chủ trọ nhưng chưa được phê duyệt
    """
    class Meta:
        proxy = True

class Follow(BaseModel):
    """
    Model lưu trữ mối quan hệ theo dõi giữa Tenant và Landlord.
    """
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name='following', 
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": UserType.TENANT},
        null=True
    )
    followee = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name='followers', 
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": UserType.LANDLORD},
        null=True,
    )

    class Meta:
        unique_together = ('follower', 'followee')  # Đảm bảo mỗi mối quan hệ là duy nhất
        db_table = "user_follow"  # Tên bảng trong cơ sở dữ liệu