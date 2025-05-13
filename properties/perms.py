from rest_framework.permissions import IsAuthenticated

class IsPropertyOwner(IsAuthenticated):

    def has_object_permission(self, request, view, property_object):
        is_authenticated = super().has_permission(request, view)
        # Kiểm tra người dùng có phải là chủ dãy trọ
        return is_authenticated and property_object.owner == request.user
