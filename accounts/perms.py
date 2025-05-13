from rest_framework import permissions
from utils.choices import UserType

class IsLandlord(permissions.IsAuthenticated):
    """
    Chỉ cho phép người dùng có loại là `LANDLORD` truy cập.
    """
    def has_permission(self, request, view):
        is_authenticated = super().has_permission(request, view)
        return is_authenticated and request.user.user_type == UserType.LANDLORD 

class IsTenant(permissions.IsAuthenticated):
    """
    Chỉ cho phép người dùng có loại là `TENANT` truy cập.
    """
    def has_permission(self, request, view):
        is_authenticated = super().has_permission(request, view)
        return is_authenticated and request.user.user_type == UserType.TENANT
