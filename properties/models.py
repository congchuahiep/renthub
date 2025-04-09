from django.contrib.contenttypes.fields import GenericRelation
from django.db import models

from utils.models import BaseModel

# Create your models here.
class BoardingHouse(BaseModel):
    """
    Model này định nghĩa một dãy trọ:
    Khi chủ trọ mới tạo một tài khoản, bắt buộc chủ trọ phải tạo một dãy trọ,
    và dãy trọ này sẽ được xét duyệt bởi quản trị viên. Nếu dãy trọ đầu tiên của
    chủ trọ đã không được xét duyệt, thì tài khoản của chủ trọ sẽ không được phép
    tạo mới.

    Ngược lại, nếu dãy trọ đã được xét duyệt, thì chủ trọ có thể tạo các bài đăng
    """

    boarding_house_name = models.CharField(max_length=256)
    address = models.CharField(max_length=256)
    images = GenericRelation("utils.Image", null=True)
