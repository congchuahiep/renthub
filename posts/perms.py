from rest_framework.permissions import IsAuthenticated


class IsRentalPostOwner(IsAuthenticated):
    """
    Chỉ cho phép chủ sở hữu bài đăng (cho thuê phòng) truy cập.
    """

    def has_object_permission(self, request, rental_post_view, rental_post_obj):
        is_authenticated = super().has_permission(request, rental_post_view)
        # Kiểm tra nếu người dùng hiện tại là chủ sở hữu bài đăng
        return is_authenticated and rental_post_obj.landlord == request.user
