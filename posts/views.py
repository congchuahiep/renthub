from rest_framework import parsers, viewsets, mixins

from accounts.perms import IsLandlord
from posts.models import RentalPost
from posts.paginators import PostPagination
from posts.perms import IsRentalPostOwner
from posts.serializers import RentalPostSerializer


# Create your views here.
class RentalPostViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin
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
    """

    queryset = RentalPost.objects.prefetch_related(
        "post",
        "utilities",
        "landlord",
        "post__images" 
    ).filter(active=True) # Sử dụng prefetch_related để tối ưu hóa câu truy vấn
    serializer_class = RentalPostSerializer
    pagination_class = PostPagination
    page_size = 10
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_permissions(self):
        """
        Cấu hình các permission của view action:
        - `IsLandlord`: create
        - `IsRentalPostOwner`: destroy, update, partial_update
        - Không có permission: list, retrieve
        """
        if self.action == "create":
            permission_classes = [IsLandlord]
        elif self.action in ["destroy", "update", "partial_update"]:
            permission_classes = [IsRentalPostOwner]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """
        Khi thức hiện phương thức `create()`, gắn landlord đang gọi API
        để trở thành chủ sở hữu của bài đăng này
        """
        instance = serializer.save(landlord=self.request.user)  # Gán landlord là user hiện tại
        # Thêm tin nhắn thông báo đã tạo thành công
        serializer.context['detail'] = f"Rental post '{instance.title}' has been created successfully."
