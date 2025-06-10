from django.db import models

class PostStatus(models.TextChoices):
    """
    Trạng thái bài viết:
        - PENDING: Đang kiểm duyệt
        - APPROVED: Đã kiểm duyệt
        - REJECTED: Từ chối kiểm duyệt
        - EXPIRED: Hết hạn
        - RENTED: Đã thuê
    """
    ACTIVE  = "active", "Đang hoạt động"
    REJECTED = "rejected", "Từ chối kiểm duyệt"
    EXPIRED = "expired", "Hết hạn"
    RENTED = "rented", "Đã thuê"

class PropertyStatus(models.TextChoices):
    """
    Trạng thái tài sản:
        - PENDING: Đang kiểm duyệt
        - APPROVED: Đã duyệt
        - REJECTED: Đã từ chối
    """
    PENDING = 'pending', 'Đang kiểm duyệt'
    APPROVED = 'approved', 'Đã duyệt'
    REJECTED = 'rejected', 'Đã từ chối'

class UserType(models.TextChoices):
    """
    Loại người dùng:
        - LANDLORD: Chủ nhà
        - TENANT: Người thuê
    """
    LANDLORD = "landlord", "Chủ nhà"
    TENANT = "tenant", "Người thuê"
