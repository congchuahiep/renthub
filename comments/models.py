from django.db import models

from utils.models import BaseModel

# Create your models here.
class CommentPost(BaseModel):
    """
    Bạn có thể thấy Post là một model trừu tượng, vậy nên các model khác
    không thể tạo tham chiếu đến Post, đó cũng là lý do ta để phần khoá
    chính của quan hệ một-một tại Post chứ không phải tại CommentPost

    Lý do ta phải để Post là trừu tượng vì chương trình có hai loại bài
    đăng là cho thuê nhà và tìm nhà cho thuê, và chúng có những chức năng
    và thuộc tính riêng biệt nhau
    """
    pass


class Comment(BaseModel):
    """
    Model này định nghĩa một bình luận của một bài đăng
    """
    post = models.ForeignKey(
        "CommentPost",
        on_delete=models.CASCADE,
        related_name="comment_post"
    )
    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="comment_post"
    )
    reply_to = models.ForeignKey(
        "Comment",
        on_delete=models.CASCADE,
        related_name="replies",
        null=True,
        blank=True
    )
    content = models.TextField(max_length=100)
