from django.db import models

# Loại người dùng Enum
class UserType(models.TextChoices):
    LANDLORD = "LR", "Landlord"
    TENANT = "TN", "Tenant"
