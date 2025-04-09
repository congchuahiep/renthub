from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models

from accounts.utils import UserType

# Create your models here.
class User(AbstractUser):
    """
    Người dùng chung: Chủ trọ và Người thuê trọ
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

    # TODO: GIAI ĐOẠN TESTING NÊN MẤY TRƯỜNG NÀY CÓ THỂ BLANK
    avatar = CloudinaryField(null=True, blank=True)
    phone_number = models.CharField(max_length=10, unique=True, blank=True, null=True)
    cccd = models.CharField(max_length=12, unique=True, blank=True, null=True)

    class Meta:
        db_table = "user"
