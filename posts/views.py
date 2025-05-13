from rest_framework import mixins, parsers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.perms import IsLandlord
from posts import paginators
from posts.models import Comment, RentalPost
from posts.paginators import PostPaginator
from posts.perms import IsCommentOwner, IsRentalPostOwner
from posts.serializers import CommentSerializer, RentalPostSerializer
from utils.choices import PostStatus



# Create your views here.
class RentalPostViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
):
    """
    ViewSet này cung cấp khả năng quản lý các Rental post

    Endpoints
    ---------
    - `GET /rentals/` : Trả về danh sách các Rentals post
    - `GET /rentals/<id>` : Trả về một Rentals post
    - `POST /rentals/` : Tạo mới một Rentals post (Chỉ cho phép landlord)
    - `DELETE /rentals/<id>` : Xoá một Rentals post (Chỉ cho phép chủ sở hữu bài đăng)
    - `PUT /rentals/<id>` : Sửa toàn bộ một Rental post (Chỉ cho phép chủ sở hữu bài đăng)
    - `PATCH /rentals/<id>` : Sửa một phần Rental post (Chỉ cho phép chủ sở hữu bài đăng)
    Quản lý comment của một bài viết:
    - `GET /rentals/<id>/comments/`: Lấy danh sách comment của bài viết
    - `POST /rentals/<id>/comments/`: Thêm comment vào bài viết
    """

    queryset = RentalPost.objects.prefetch_related(
        "post", "utilities", "landlord", "post__images"
    ).filter(status=PostStatus.APPROVED)  # Sử dụng prefetch_related để tối ưu hóa câu truy vấn
    serializer_class = RentalPostSerializer
    pagination_class = PostPaginator
    page_size = 10
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_permissions(self):
        """
        Cấu hình các permission của view action:
        - `IsLandlord`: create, POST comments
        - `IsRentalPostOwner`: destroy, update, partial_update
        - Không có permission: list, retrieve, GET /comments/
        """
        if self.action == "create":
            return [IsLandlord()]
        elif self.action in ["destroy", "update", "partial_update"]:
            return [IsRentalPostOwner()]
        elif self.action == "comments" and self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        """
        Khi thức hiện phương thức `create()`, gắn landlord đang gọi API
        để trở thành chủ sở hữu của bài đăng này
        """
        instance = serializer.save(
            landlord=self.request.user
        )  # Gán landlord là user hiện tại
        # Thêm tin nhắn thông báo đã tạo thành công
        serializer.context["detail"] = (
            f"Rental post '{instance.title}' has been created successfully."
        )

    @action(detail=True, methods=["get", "post"], url_path="comments")
    def comments(self, request, pk=None):
        """
        Quản lý comment của một bài viết:
        - `GET /rentals/<id>/comments/`: Lấy danh sách comment của bài viết
        - `POST /rentals/<id>/comments/`: Thêm comment vào bài viết
        """
        rental_post = self.get_object()

        if request.method == "GET":
            comments = rental_post.post.comments.select_related("user").filter(
                active=True
            )
            paginator = paginators.CommentPaginator()

            # Danh sách bình luận đã được phân trang
            paginated_comments = paginator.paginate_queryset(comments, self.request)

            if paginated_comments is not None:
                serializer = CommentSerializer(paginated_comments, many=True)
                return paginator.get_paginated_response(serializer.data)
            else:
                serializer = CommentSerializer(comments, many=True)
                return Response(serializer.data)

        elif request.method == "POST":
            serializer = CommentSerializer(
                data={
                    "content": request.data.get("content"),
                    "user": request.user.pk,
                    "post": pk,
                }
            )
            serializer.is_valid(raise_exception=True)
            comment = serializer.save()
            return Response(
                CommentSerializer(comment).data, status=status.HTTP_201_CREATED
            )


class CommentViewSet(
    viewsets.GenericViewSet,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin
):
    """
    ViewSet này cung cấp khả năng cho phép chủ sở hữu comment được
    xoá và chỉnh sửa comment

    Endpoints
    ---------
    - `DELETE /comments/<id>` : Xoá một Comment
    - `PUT /comments/<id>` : Sửa toàn bộ một Comment
    - `PATCH /comments/<id>` : Sửa một phần Comment
    """
    queryset = Comment.objects.filter(active=True)
    serializer_class = CommentSerializer
    permission_classes = [IsCommentOwner]
