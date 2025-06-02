from rest_framework.permissions import IsAuthenticated


class IsPostOwner(IsAuthenticated):

    message = "Bạn không có quyền thực hiện thao tác này trên bài đăng không phải của bạn!"

    def has_object_permission(self, request, post_view, post_object):
        is_authenticated = super().has_permission(request, post_view)
        # Kiểm tra nếu người dùng hiện tại là chủ sở hữu bài đăng
        return is_authenticated and post_object.owner == request.user


class IsCommentOwner(IsAuthenticated):
    """
    Chỉ cho phép chủ sở hữu bình luận truy cập.
    """

    message = "Bạn không có quyền thực hiện thao tác này trên bình luận không phải của bạn!"

    def has_object_permission(self, request, comment_view, comment_obj):
        is_authenticated = super().has_permission(request, comment_view)

        return is_authenticated and comment_obj.user == request.user