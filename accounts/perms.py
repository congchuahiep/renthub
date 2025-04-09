from rest_framework import permissions
from accounts.utils import UserType

class IsLandlord(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        is_authenticated = super().has_permission(request, view)
        return is_authenticated and request.user.user_type == UserType.LANDLORD

class IsTenant(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        is_authenticated = super().has_permission(request, view)
        return is_authenticated and request.user.user_type == UserType.TENANT
