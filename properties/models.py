from django.db import models

from utils.models import BaseModel

# Create your models here.
class Property(BaseModel):
    """
    Model này định nghĩa một dự án bất động sản - aka "Dãy trọ"

    Khi chủ trọ mới tạo một tài khoản, để tài khoản được kích hoạt, yêu cầu tài khoản chủ
    trọ phải xác minh một dự án bất động sản (dãy trọ). Nếu dãy trọ đầu tiên của chủ trọ
    được xét duyệt, tài khoản chủ trọ sẽ được kích hoạt.

    Ngược lại, nếu dãy trọ đầu tiên không được duyệt, thì tài khoản chủ trọ sẽ không được
    chấp nhận và bị xoá.
    """

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)

    properties_name = models.CharField(max_length=256)

    province = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    address = models.CharField(max_length=256)
