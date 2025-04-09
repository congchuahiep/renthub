from django.db import models
from cloudinary.models import CloudinaryField

from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation

from accounts.utils import UserType

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



class CommentPost(BaseModel):
    pass


class Comment(BaseModel):
    post = models.ForeignKey(
        CommentPost, on_delete=models.CASCADE, related_name="comment_post"
    )
    user = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="comment_post"
    )
    content = models.TextField(max_length=100)
    reply_to = models.ForeignKey(
        "Comment", on_delete=models.CASCADE, related_name="replies", null=True
    )


class Conversation(BaseModel):
    landlord = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": UserType.LANDLORD},
        related_name="landlord_convarsation",
        null=False,
    )
    tenent = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": UserType.TENANT},
        related_name="tenant_convarsation",
        null=False,
    )


class Message(BaseModel):
    composation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    content = models.TextField(null=False)
