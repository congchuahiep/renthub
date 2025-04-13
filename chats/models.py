from django.db import models
from django.core.exceptions import ValidationError
from accounts.utils import UserType
from utils.models import BaseModel

# Create your models here.
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

    def __str__(self):
        return f"Chat between [{self.landlord}] and [{self.tenent}]"


class Message(BaseModel):
    """
    Model này dùng để quản lý các tin nhắn trong một cuộc trò chuyện.
    """
    conversation = models.ForeignKey("Conversation", on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    content = models.TextField(null=False)

    class Meta:
        ordering = ["-created_date"]

    def clean(self):
        if self.sender not in [self.conversation.landlord, self.conversation.tenent]:
            raise ValidationError("Người gửi không thuộc cuộc trò chuyện này.")

    def save(self, *args, **kwargs):
        self.clean()  # gọi clean() trước khi lưu
        super().save(*args, **kwargs)
