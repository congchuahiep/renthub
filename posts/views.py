from rest_framework import mixins, parsers, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.perms import IsLandlord, IsTenant
from posts import paginators
from posts.models import Comment, RentalPost, RoomSeekingPost, Utilities
from posts.paginators import PostPaginator
from posts.perms import IsCommentOwner, IsPostOwner
from posts.serializers import (
    CommentSerializer,
    RentalPostSerializer,
    RoomSeekingPostSerializer,
    UtilitiesSerializer,
)
from utils.choices import PostStatus
from utils.geocoding import get_bounding_box, haversine


class CommentActionMixin:
    @action(detail=True, methods=["get", "post"], url_path="comments")
    def comments(self, request, pk=None):
        post = self.get_object()

        if request.method == "GET":
            comments = (
                post.post.comments.select_related("user")
                .filter(active=True, reply_to=None)
                .order_by("-created_date")
            )
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
                    "reply_to": request.data.get("reply_to"),
                }
            )
            serializer.is_valid(raise_exception=True)
            comment = serializer.save()
            return Response(
                CommentSerializer(comment).data, status=status.HTTP_201_CREATED
            )

    @action(
        detail=True, methods=["get"], url_path="comments/(?P<comment_id>[^/.]+)/replies"
    )
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

        replies = (
            comment.replies.select_related("user")
            .filter(active=True)
            .order_by("created_date")
        )
        print(replies)
        serializer = CommentSerializer(replies, many=True)
        return Response(serializer.data)


class CommentViewSet(
    viewsets.GenericViewSet, mixins.DestroyModelMixin, mixins.UpdateModelMixin
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


# Create your views here.
class RentalPostViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,  # `GET /rentals/`
    mixins.RetrieveModelMixin,  # `GET /rentals/<id>`
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    CommentActionMixin,
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

    # def get_queryset(self):
    #     queryset = RentalPost.objects.prefetch_related(
    #         "post", "utilities", "owner", "post__images"
    #     ).order_by("-created_date")

    #     # Nếu không phải action "mypost", chỉ lấy bài viết đang active
    #     if self.action != "mypost":
    #         queryset = queryset.filter(status=PostStatus.ACTIVE)
    queryset = RentalPost.objects.prefetch_related(
        "post", "utilities", "owner", "post__images"
    ).filter(
        status=PostStatus.ACTIVE
    )  # Sử dụng prefetch_related để tối ưu hóa câu truy vấn
    serializer_class = RentalPostSerializer
    pagination_class = PostPaginator
    page_size = 10
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_permissions(self):
        """
        Cấu hình các permission của view action:
        - `IsLandlord`, `IsPropertyOwner`: create, POST comments
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

    def get_queryset(self):
        queryset = super().get_queryset()

        if(self.action=='retrieve'):
            return RentalPost.objects.all()

        # Lọc theo tỉnh/huyện/xã
        # NOTE: Lọc địa điểm này chưa có rằng buộc giữa tỉnh, quận, huyện
        province_id = self.request.query_params.get("province_id")
        district_id = self.request.query_params.get("district_id")
        ward_id = self.request.query_params.get("ward_id")
        if province_id:
            queryset = queryset.filter(property__province__code=province_id)
        if district_id:
            queryset = queryset.filter(property__district__code=district_id)
        if ward_id:
            queryset = queryset.filter(property__ward__code=ward_id)

        # Lọc theo giá
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        try:
            if min_price:
                min_price = float(min_price)
            if max_price:
                max_price = float(max_price)

            # Kiểm tra logic
            if (
                min_price is not None
                and max_price is not None
                and min_price > max_price
            ):
                raise ValueError("Giá thấp nhất không được lớn hơn giá cao nhất.")

            if min_price is not None:
                queryset = queryset.filter(price__gte=min_price)
            if max_price is not None:
                queryset = queryset.filter(price__lte=max_price)

        except ValueError as e:
            raise ValidationError({"price": str(e)})

        # Lọc theo số người ở
        min_person = self.request.query_params.get("min_limit_person")
        max_person = self.request.query_params.get("max_limit_person")
        if min_person:
            queryset = queryset.filter(limit_person__gte=int(min_person))
        if max_person:
            queryset = queryset.filter(limit_person__lte=int(max_person))

        # Lọc theo xung quanh vị trí chỉ định
        lat = float(self.request.query_params.get("latitude", 0))
        lon = float(self.request.query_params.get("longitude", 0))
        radius = float(self.request.query_params.get("radius", 5))  # km
        if lat and lon:
            lat = float(lat)
            lon = float(lon)

            bounds = get_bounding_box(lat, lon, radius)

            queryset = queryset.filter(
                property__latitude__gte=bounds["min_lat"],
                property__latitude__lte=bounds["max_lat"],
                property__longitude__gte=bounds["min_lon"],
                property__longitude__lte=bounds["max_lon"],
            )

            # Sau khi lọc bằng bounding box (hình chữ nhận)
            # cần lọc thêm bằng haversine (bằng bán kính tròn)
            queryset = [
                p
                for p in queryset
                if haversine(lat, lon, p.property.latitude, p.property.longitude)
                <= radius
            ]

            # Thêm thuộc tính distance
            for p in queryset:
                p.distance = haversine(
                    lat, lon, p.property.latitude, p.property.longitude
                )

        return queryset

    def list(self, request, *args, **kwargs):
        """
        Ghi đè lại để lấy thêm thông tin distance (khi lọc bằng một vị trí cụ thể)
        """
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = serializer.data

            # Thêm thông tin distance thủ công nếu cần
            for i, item in enumerate(data):
                if hasattr(page[i], "distance"):
                    item["distance"] = round(page[i].distance, 2)

            return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        for i, item in enumerate(data):
            if hasattr(queryset[i], "distance"):
                item["distance"] = round(queryset[i].distance, 2)

        return Response(data)

    def perform_create(self, serializer):
        """
        Khi thức hiện phương thức `create()`, gắn landlord đang gọi API
        để trở thành chủ sở hữu của bài đăng này
        # """
       
        instance = serializer.save(
            owner=self.request.user
        )  # Gán landlord là user hiện tại
        # Thêm tin nhắn thông báo đã tạo thành công
        serializer.context["detail"] = (
            f"Rental post '{instance.title}' has been created successfully."
        )

    @action(methods=["get"], detail=False,url_path="my-rental-posts")
    def mypost(self,request):
        owner =  request.user
        print(owner)
        my_rental_posts = RentalPost.objects.filter(owner=owner)
        serializer=RentalPostSerializer(my_rental_posts,many=True,context={"request":request})
        return Response(serializer.data)


class RoomSeekingPostViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    CommentActionMixin,
):
    queryset = RoomSeekingPost.objects.filter(
        status=PostStatus.ACTIVE
    ).order_by("-created_date") 
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
        return [AllowAny()]

    def get_queryset(self):
        if(self.action=='retrieve'):
            return RoomSeekingPost.objects.all()
        return super().get_queryset()
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    

    @action(methods=["get"], detail=False,url_path="my-roomseeking-posts")
    def mypost(self,request):
        owner =  request.user
        print(owner)
        my_roomseeking_post = RoomSeekingPost.objects.filter(owner=owner)
        serializer=RoomSeekingPostSerializer(my_roomseeking_post,many=True,context={"request":request})
        return Response(serializer.data)



class UtilitiesViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """
    ViewSet này dùng để xem các danh sách các Utilities có sẵn

    Endpoints
    ---------
    - `GET /utilities/` : Lấy danh sách các utility
    """

    queryset = Utilities.objects.filter(active=True)
    serializer_class = UtilitiesSerializer
