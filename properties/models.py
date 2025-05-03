from django.db import models

from utils.choices import PropertyStatus, UserType
from utils.geocoding import get_coordinates
from utils.models import BaseModel, Image


# Create your models here.
class Property(BaseModel):
    """
    Model này định nghĩa một dự án bất động sản - aka "Dãy trọ"

    Khi chủ trọ mới tạo một tài khoản, để tài khoản được kích hoạt, yêu cầu tài khoản chủ
    trọ phải xác minh một dự án bất động sản (dãy trọ). Nếu dãy trọ đầu tiên của chủ trọ
    được xét duyệt, tài khoản chủ trọ sẽ được kích hoạt.

    Ngược lại, nếu dãy trọ đầu tiên không được duyệt, thì tài khoản chủ trọ sẽ không được
    chấp nhận và gửi thông báo qua email.

    Nếu như dãy trọ đầu tiên của tài khoản chủ trọ chưa được kích hoạt được duyệt, thì tài
    khoản chủ trọ và dãy trọ sẽ được kích hoạt đồng thời, chúng được triển khai trong hàm
    signal sau:
    ```
    /properties/signals.py/handle_property_and_landlord_approval/
    ```

    Fields
    ------
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

    
    province = models.ForeignKey(
        "locations.Province", on_delete=models.SET_NULL, null=True, blank=True, related_name="properties"
    )
    district = models.ForeignKey(
        "locations.District", on_delete=models.SET_NULL, null=True, blank=True, related_name="properties"
    )
    ward = models.ForeignKey(
        "locations.Ward", on_delete=models.SET_NULL, null=True, blank=True, related_name="properties"
    )
    address = models.CharField(max_length=256, null=False, blank=False)
    
    def __str__(self):
        return f"{self.name}"
    
    # Toạ độ thực tế (kinh độ và vĩ độ) của dãy trọ
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        """
        Lưu toạ độ của dãy trọ dựa trên địa chỉ của nó.
        """
        if not self.latitude or not self.longitude:
            address = f"{self.address}, {self.ward}, {self.district}, {self.province}, Việt Nam"
            self.latitude, self.longitude = get_coordinates(address)
        super().save(*args, **kwargs)


class PropertyImage(Image):
    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="images",
        null=True
    )

    class Meta:
        verbose_name = "Hình ảnh dãy trọ"
        verbose_name_plural = "Hình ảnh dãy trọ"
