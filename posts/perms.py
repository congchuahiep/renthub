from rest_framework.permissions import IsAuthenticated


class IsRentalPostOwner(IsAuthenticated):
    """
    Chỉ cho phép chủ sở hữu bài đăng (cho thuê phòng) truy cập.
    """
    message = "You are not the owner of this post!"

    def has_object_permission(self, request, rental_post_view, rental_post_obj):
        is_authenticated = super().has_permission(request, rental_post_view)
        # Kiểm tra nếu người dùng hiện tại là chủ sở hữu bài đăng
        return is_authenticated and rental_post_obj.landlord == request.user


class IsCommentOwner(IsAuthenticated):
    """
    Chỉ cho phép chủ sở hữu bình luận truy cập.
    """
    message = "You are not the owner of this comment!"

    def has_object_permission(self, request, comment_view, comment_obj):
        is_authenticated = super().has_permission(request, comment_view)

        return is_authenticated and comment_obj.user == request.user