from rest_framework import mixins, parsers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.perms import IsLandlord, IsTenant
from posts import paginators
from posts.models import Comment, RentalPost, RoomSeekingPost
from posts.paginators import PostPaginator
from posts.perms import IsCommentOwner, IsPostOwner
from posts.serializers import (
    CommentSerializer,
    RentalPostSerializer,
    RoomSeekingPostSerializer,
)
from utils.choices import PostStatus

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from posts.models import Comment
from posts.serializers import CommentSerializer




class CommentActionMixin:

    @action(detail=True, methods=["get", "post"], url_path="comments")
    def comments(self, request, pk=None):
        post = self.get_object()

        if request.method == "GET":
            comments = post.post.comments.select_related("user").filter(active=True, reply_to=None).order_by("-created_date")
            paginator = paginators.CommentPaginator()
            paginated_comments = paginator.paginate_queryset(comments, request)

            serializer = CommentSerializer(paginated_comments, many=True)
            return paginator.get_paginated_response(serializer.data)


        elif request.method == "POST":
            serializer = CommentSerializer(
                data={
                    "content": request.data.get("content"),
                    "user": request.user.pk,
                    "post": pk,
                    "reply_to": request.data.get("reply_to"),  # 👈 Thêm dòng này!
                }
            )
            serializer.is_valid(raise_exception=True)
            comment = serializer.save()
            return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
    @action(detail=True, methods=["get"], url_path="comments/(?P<comment_id>[^/.]+)/replies")
    def comment_replies(self, request, pk=None, comment_id=None):
        """
        API: GET /rentals/<post_id>/comments/<comment_id>/replies/
        Trả về danh sách các comment trả lời cho một comment
        """
        post = self.get_object()

        try:
            comment = post.post.comments.get(pk=comment_id, active=True)
        except Comment.DoesNotExist:
            return Response({"detail": "Comment not found."}, status=404)

        replies = comment.replies.select_related("user").filter(active=True).order_by("created_date")
        print(replies)
        serializer = CommentSerializer(replies, many=True)
        return Response(serializer.data)

# Create your views here.
class RentalPostViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,  # `GET /rentals/`
    mixins.RetrieveModelMixin,  # `GET /rentals/<id>`
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    CommentActionMixin
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
        "post", "utilities", "owner", "post__images"
    ).filter(
        status=PostStatus.APPROVED
    )  # Sử dụng prefetch_related để tối ưu hóa câu truy vấn
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
            return [IsPostOwner()]
        elif self.action == "comments" and self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        """
        Khi thức hiện phương thức `create()`, gắn landlord đang gọi API
        để trở thành chủ sở hữu của bài đăng này
        """
        instance = serializer.save(
            owner=self.request.user
        )  # Gán landlord là user hiện tại
        # Thêm tin nhắn thông báo đã tạo thành công
        serializer.context["detail"] = (
            f"Rental post '{instance.title}' has been created successfully."
        )
        
       

    



class RoomSeekingPostViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    CommentActionMixin
):
    queryset = RoomSeekingPost.objects.filter(active=True).order_by("-created_date")
    serializer_class = RoomSeekingPostSerializer
    pagination_class = PostPaginator
    page_size = 10
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_permissions(self):
        if self.action == "create":
            return [IsTenant()]
        elif self.action in ["destroy", "update", "partial_update"]:
            return [IsPostOwner()]
        elif self.action == "comments" and self.request.method == "POST":
            return [IsAuthenticated()]
        # else phần comments thằng Hiệp làm thằng Tín đéo biết
        # Hiệp: chấm hỏi =)))?
        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

   