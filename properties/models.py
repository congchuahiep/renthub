from django.db import models

from utils.choices import PropertyStatus, UserType
from utils.models import BaseModel, ImageManagement


# Create your models here.
class Property(BaseModel, ImageManagement):
    """
    Model này định nghĩa một dự án bất động sản - aka "Dãy trọ"

    Khi chủ trọ mới tạo một tài khoản, để tài khoản được kích hoạt, yêu cầu tài khoản chủ
    trọ phải xác minh một dự án bất động sản (dãy trọ). Nếu dãy trọ đầu tiên của chủ trọ
    được xét duyệt, tài khoản chủ trọ sẽ được kích hoạt.

    Ngược lại, nếu dãy trọ đầu tiên không được duyệt, thì tài khoản chủ trọ sẽ không được
    chấp nhận và bị xoá.
    """

    status = models.CharField(max_length=10, choices=PropertyStatus.choices, default=PropertyStatus.PENDING)

    owner = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": UserType.LANDLORD},
        related_name="properties",
        null=True
    )

    properties_name = models.CharField(max_length=256)

    province = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    address = models.CharField(max_length=256)
