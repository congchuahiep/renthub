from rest_framework import generics, parsers, viewsets

from accounts.perms import IsLandlord
from posts.models import RentalPost
from posts.paginators import PostPagination
from posts.perms import IsRentalPostOwner
from posts.serializers import RentalPostSerializer


# Create your views here.
class RentalPostViewSet(
    viewsets.ViewSet,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.CreateAPIView,
    generics.DestroyAPIView,
):
    """
    ViewSet này cung cấp khả năng quản lý các Rental post

    Endpoints
    ---------
    - `GET /rentals/` : Trả về danh sách các Rentals post
    - `GET /rentals/<id>` : Trả về một Rentals post
    - `POST /rentals/` : Tạo mới một Rentals post (Chỉ cho phép landlord)
    - `DELETE /rentals/<id>' : Xoá một Rentals post (Chỉ cho phép chủ sở hữu bài đăng)
    TODO: Thêm phương thức PUT và PATCH
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
        - `create()` : `IsLandlord`
        - `destroy()`: `IsRentalPostOwner`
        - `Còn lại` : Bất kỳ...
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
        serializer.save(landlord=self.request.user)  # Gán landlord là user hiện tại
