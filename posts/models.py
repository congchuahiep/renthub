from django.db import models

from django.utils import timezone

from utils.choices import PostStatus, PropertyStatus, UserType
from utils.models import BaseModel, Image

def default_post_expiration_date():
    return timezone.now() + timezone.timedelta(days=7)

# Create your models here.
class PostReference(models.Model):
    """
    Model này chỉ dùng để làm reference cho các loại post khác. Mục đích
    chính là để tạo khả năng khoá ngoại trỏ đến bài đăng.

    Ngoài ra các model của BasePost sẽ sử dụng khoá chính của PostReference làm
    khoá chính của bản thân mình
    """
    pass

class BasePostContent(BaseModel):
    """
    Là một model trừu tượng, được sử dụng để định nghĩa các thuộc tính chung
    cho hai model con:
    - RentalPost
    - RoomSeekingPost

    Fields
    ------
    - `title`: Tiêu đề của bài đăng
    - `content`: Nội dung của bài đăng
    - `status`: Trạng thái của bài đăng
    - `expired_date`: Ngày hết hạn của bài đăng
    - `images`: Danh sách hình ảnh của bài đăng
    """

    # id được trỏ tới model Post
    post = models.OneToOneField("PostReference", on_delete=models.CASCADE, primary_key=True)

    # Các trường dữ liệu chung
    title = models.CharField(max_length=256)
    content = models.TextField(null=True)
    status = models.CharField(max_length=10, choices=PostStatus, default=PostStatus.PENDING)

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
        
    def save(self, *args, **kwargs):
        """
        Ghi đè phương thức save() để tự động tạo khoá chính `PostReference`
        nếu nó chưa tồn tại
        """
        if not self.post_id:
            self.post = PostReference.objects.create()
        super().save(*args, **kwargs)


class RentalPost(BasePostContent):
    """
    Model này định nghĩa một bài đăng cho thuê nhà của một chủ thuê.
    Nó kế thừa từ lớp trừu tượng `Post`

    Fields
    ------
    - `landlord`: Chủ nhà của bài đăng
    - `property`: Dãy trọ mà bài đăng này thuộc
    - `price`: Giá thuê của bài đăng
    - `limit_person`: Số người tối đa cho thuê
    - `area`: Diện tích của phòng trọ
    - `number_of_bedrooms`: Số phòng ngủ của phòng trọ
    - `number_of_bathrooms`: Số phòng tắm của phòng trọ
    - `utilities`: Danh sách tiện ích của phòng trọ
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


class RoomSeekingPost(BasePostContent):
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


class ImagePost(Image):
    post = models.ForeignKey(
        "PostReference",
        on_delete=models.CASCADE,
        related_name="images",
    )

class Utilities(BaseModel):
    """
    Model này dùng để hỗ trợ cho Model RentalPost,
    thêm các thông tin về tiện ích cho căn phòng
    của bài đăng cho thuê nhà
    """

    name = models.CharField(max_length=256)

    def __str__(self):
        return self.name

class Comment(BaseModel):
    """
    Model này định nghĩa một bình luận của một bài đăng
    """
    post = models.ForeignKey(
        "posts.PostReference",
        on_delete=models.CASCADE,
        related_name="comments"
    )
    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="comments_history"
    )
    reply_to = models.ForeignKey(
        "posts.Comment",
        on_delete=models.CASCADE,
        related_name="replies",
        null=True,
        blank=True
    )
    content = models.TextField(max_length=100)