from django.db import models

from accounts.utils import UserType
from utils.models import BaseModel, ImageManagement

# Create your models here.
class Post(BaseModel, ImageManagement):
    class Status(models.TextChoices):
        PENDING = "pd", "Đang kiểm duyệt"
        APPROVED = "ap", "Đã kiểm duyệt"
        REJECTED = "rj", "Từ chối kiểm duyệt"
        EXPIRED = "ep", "Hết hạn"
        RENTED = "rt", "Đã thuê"

    class PostType(models.TextChoices):
        RENTAL = 'RENTAL', 'Rental Post'
        SEEKING = 'SEEKING', 'Seeking Post'

    title = models.CharField(max_length=256)
    content = models.TextField(null=True)
    status = models.CharField(max_length=10, choices=Status, default=Status.PENDING)
    post_type = models.CharField(max_length=20, choices=PostType.choices)

    class Meta:
        ordering = ["-created_date"]

    # def save(self, *args, **kwargs):
    #     """
    #     Tự động tạo một comment_post mới khi tạo một bài đăng
    #     """
    #     if not self.comment_post:  # Nếu chưa có đối tượng `B`, thì tạo mới
    #         from comments.models import CommentPost
    #         self.comment_post = CommentPost.objects.create()
    #     super().save(*args, **kwargs)  # Gọi phương thức `save()` của lớp cha

    def __str__(self):
        return self.title


class RentalPost(models.Model):
    """
    Model này định nghĩa một bài đăng cho thuê nhà của
    một chủ thuê
    """

    post = models.OneToOneField(
        "posts.Post",
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='rental_details'
    )

    # Chỉ định chỉ cho phép người đăng bài cho thuê nhà là Chủ nhà
    landlord = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": UserType.LANDLORD},
        null=True,
    )

    province = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    address = models.CharField(max_length=256)
    price = models.FloatField(null=True, blank=True)
    limit_person = models.IntegerField(null=True, blank=True)
    area = models.FloatField()
    number_of_bedrooms = models.IntegerField(null=True, blank=True)
    number_of_bathrooms = models.IntegerField(null=True, blank=True)
    utilities = models.ManyToManyField("Utilities", related_name="rental_posts", blank=True)


class RoomSeekingPost(models.Model):

    post = models.OneToOneField(
        "posts.Post",
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='seeking_details'
    )

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
