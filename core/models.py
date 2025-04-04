from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField

from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation


class User(AbstractUser):
    """
    Người dùng chung: Chủ trọ và Người thuê trọ
    """

    # Loại người dùng Enum
    class UserType(models.TextChoices):
        LANDLORD = "LR", "Landlord"
        TENANT = "TN", "Tenant"

    # Loại người dùng
    user_type = models.CharField(
        max_length=10,
        choices=UserType,
        default=UserType.TENANT,
    )

    # TODO: GIAI ĐOẠN TESTING NÊN MẤY TRƯỜNG NÀY CÓ THỂ BLANK
    avatar = CloudinaryField(null=True, blank=True)
    phone_number = models.CharField(max_length=10, unique=True, blank=True, null=True)
    cccd = models.CharField(max_length=12, unique=True, blank=True, null=True)

    class Meta:
        db_table = "user"


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Image(models.Model):
    image = CloudinaryField(null=False)
    alt = models.CharField(max_length=256, blank=True, null=True)


class ImageRelation(models.Model):
    """
    Model này dùng để quản lý mối quan hệ giữa ảnh và với các loại model khác
    """

    image = models.ForeignKey(
        "Image", on_delete=models.CASCADE, related_name="relations"
    )
    # generic_model là một trường ForeignKey đến ContentType
    # nó chấp nhận mọi loại model trong Django đều có thể làm
    # khoá ngoại cho trường này
    generic_model = models.ForeignKey(ContentType, on_delete=models.CASCADE) # Loại đối tượng

    # object_id là một trường IntegerField, nó lưu trữ ID của đối tượng
    object_id = models.PositiveIntegerField() # ID của đối tượng
    # đối tượng sau khi đã được ánh xạ với generic_model và object_id
    content_object = GenericForeignKey("generic_model", "object_id")

    class Meta:
        db_table = "image_relation"


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
    images = GenericRelation(Image, null=True)


class Utilities(BaseModel):
    """
    Model này dùng để hỗ trợ cho Model RentalPost,
    thêm các thông tin về tiện ích cho căn phòng
    của bài đăng cho thuê nhà
    """

    name = models.CharField(max_length=256)


class Post(BaseModel):
    class Status(models.TextChoices):
        PENDING = "pd", "Đang kiểm duyệt"
        APPROVED = "ap", "Đã kiểm duyệt"
        REJECTED = "rj", "Từ chối kiểm duyệt"
        EXPIRED = "ep", "Hết hạn"
        RENTED = "rt", "Đã thuê"

    title = models.CharField(max_length=256)
    content = models.TextField(null=True)
    status = models.CharField(max_length=10, choices=Status, default=Status.PENDING)
    comment_post = models.OneToOneField("CommentPost", on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        abstract = True
        ordering = ["-created_date"]

    def save(self, *args, **kwargs):
        """
        Tự động tạo một comment_post mới khi tạo một bài đăng
        """
        if not self.comment_post:  # Nếu chưa có đối tượng `B`, thì tạo mới
            self.comment_post = CommentPost.objects.create()
        super().save(*args, **kwargs)  # Gọi phương thức `save()` của lớp cha


class RentalPost(Post):
    """
    Model này định nghĩa một bài đăng cho thuê nhà của
    một chủ thuê
    """

    # Chỉ định chỉ cho phép người đăng bài cho thuê nhà là Chủ nhà
    landlord = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": User.UserType.LANDLORD},
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
    utilities = models.ManyToManyField("Utilities", related_name="rental_posts", null=True, blank=True)


class RoomSeekingPost(Post):
    tenent = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": User.UserType.TENANT},
        related_name="room_seeking_post",
        null=False,
    )
    position = models.CharField(max_length=20)
    area = models.FloatField(null=False)
    limit_person = models.IntegerField()


class CommentPost(BaseModel):
    pass


class Comment(BaseModel):
    post = models.ForeignKey(
        CommentPost, on_delete=models.CASCADE, related_name="comment_post"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comment_post"
    )
    content = models.TextField(max_length=100)
    reply_to = models.ForeignKey(
        "Comment", on_delete=models.CASCADE, related_name="replies", null=True
    )


class Conversation(BaseModel):
    landlord = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": User.UserType.LANDLORD},
        related_name="landlord_convarsation",
        null=False,
    )
    tenent = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": User.UserType.TENANT},
        related_name="tenant_convarsation",
        null=False,
    )


class Message(BaseModel):
    composation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    content = models.TextField(null=False)
