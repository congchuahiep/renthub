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
    chấp nhận và gửi thông báo qua email.

    Phương thức duyệt tài khoản chủ trọ khi dãy trọ đầu tiên được duyệt được triển khai trong:
    ```
    /properties/signals.py/handle_property_and_landlord_approval/
    ```

    Các trường dữ liệu:
        - `name`: Tên của dãy trọ
        - `owner`: Chủ trọ của dãy trọ
        - `images`: Hình ảnh của dãy trọ
        - `status`: Trạng thái của dãy trọ
        - `province`: Tỉnh của dãy trọ
        - `district`: Quận của dãy trọ
        - `address`: Địa chỉ của dãy trọ
    """

    status = models.CharField(max_length=10, choices=PropertyStatus.choices, default=PropertyStatus.PENDING)

    owner = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": UserType.LANDLORD},
        related_name="properties",
        null=True
    )

    name = models.CharField(max_length=256)

    province = models.CharField(max_length=256)
    district = models.CharField(max_length=256)
    address = models.CharField(max_length=256)
