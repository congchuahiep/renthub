from django.db import models

from django.utils import timezone

from utils.choices import PropertyStatus, UserType
from utils.models import BaseModel, ImageManagement

def default_post_expiration_date():
    return timezone.now() + timezone.timedelta(days=7)

# Create your models here.
class Post(BaseModel, ImageManagement):
    """
    Model này định nghĩa một bài đăng:
        -
    """

    title = models.CharField(max_length=256)
    content = models.TextField(null=True)
    status = models.CharField(max_length=10, choices=PropertyStatus, default=PropertyStatus.PENDING)

    # Tự động thiết lập bài đăng hết hạn sau 7 ngày
    expired_date = models.DateTimeField(
        default=default_post_expiration_date,
        null=True,
        blank=True
    )

    class Meta:
        abstract = True
        ordering = ["-created_date"]

    def __str__(self):
        return self.title


class RentalPost(Post):
    """
    Model này định nghĩa một bài đăng cho thuê nhà của
    một chủ thuê
    """

    # Chỉ định chỉ cho phép người đăng bài cho thuê nhà là Chủ nhà
    landlord = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": UserType.LANDLORD},
        null=True,
    )

    # Dãy trọ mà bài đăng này thuộc
    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        null=True,
        limit_choices_to={"status": PropertyStatus.APPROVED}
    )

    price = models.FloatField(null=True, blank=True)
    limit_person = models.IntegerField(null=True, blank=True)
    area = models.FloatField()
    number_of_bedrooms = models.IntegerField(null=True, blank=True)
    number_of_bathrooms = models.IntegerField(null=True, blank=True)
    utilities = models.ManyToManyField("Utilities", related_name="rental_posts", blank=True)


class RoomSeekingPost(Post):
    tenent = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": UserType.TENANT},
        related_name="room_seeking_post",
        null=False,
    )
    position = models.CharField(max_length=20)
    area = models.FloatField(null=False)
    limit_person = models.IntegerField()

class Utilities(BaseModel):
    """
    Model này dùng để hỗ trợ cho Model RentalPost,
    thêm các thông tin về tiện ích cho căn phòng
    của bài đăng cho thuê nhà
    """

    name = models.CharField(max_length=256)

    def __str__(self):
        return self.name
