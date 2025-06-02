from rest_framework import permissions
from utils.choices import UserType

class IsLandlord(permissions.IsAuthenticated):
    """
    Chỉ cho phép người dùng có loại là `LANDLORD` truy cập.
    """

    message = "Chỉ người dùng loại 'chủ trọ' mới được phép thực hiện thao tác này!"

    def has_permission(self, request, view):
        is_authenticated = super().has_permission(request, view)
        return is_authenticated and request.user.user_type == UserType.LANDLORD 

class IsTenant(permissions.IsAuthenticated):
    """
    Chỉ cho phép người dùng có loại là `TENANT` truy cập.
    """

    message = "Chỉ người dùng loại 'người thuê' mới được phép thực hiện thao tác này!"

    def has_permission(self, request, view):
        is_authenticated = super().has_permission(request, view)
        return is_authenticated and request.user.user_type == UserType.TENANT


class IsFollower(permissions.IsAuthenticated):
    """
    Chỉ cho phép người dùng là follower của bản ghi Follow được xóa.
    """
    def has_object_permission(self, request, view, obj):
        # Kiểm tra nếu người dùng hiện tại là follower
        return obj.follower == request.user