from django.db import models

from utils.models import BaseModel

# Create your models here.
class CommentPost(BaseModel):
    pass


class Comment(BaseModel):
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
