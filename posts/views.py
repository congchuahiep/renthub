from rest_framework import generics, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from accounts.perms import IsLandlord, IsTenant
from posts.models import RentalPost, RoomSeekingPost
from posts.paginators import PostPagination
from posts.serializers import RentalPostSerializer, RoomSeekingPostSerializer



# Create your views here.
class RentalPostViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.CreateAPIView):
    """
    ViewSet này cung cấp khả năng quản lý các Rental post

    Endpoints:
        - `GET /rentals/ ` : Trả về danh sách các Rentals post
        - `GET /rentals/<id>` : Trả về một Rentals post
        - `POST /rentals/ ` : Tạo mới một Rentals post
    """

    # Sử dụng prefetch_related để tối ưu hóa câu truy vấn
    queryset = RentalPost.objects.prefetch_related("post", "utilities", "landlord", "post__images").filter(active=True)
    serializer_class = RentalPostSerializer
    pagination_class = PostPagination
    page_size = 10

    # Thêm parser cho file upload, nhưng không hiểu tại sao khi thêm parser thì nó lại không hoạt động
    # parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        """
        Cấu hình các permission của view action:
            - `create()` : IsAuthenticated, IsLandlord
            - Còn lại : Bất kỳ...
        """
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsLandlord]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """
        Ghi đè phương thức create() để xử lý việc tạo bài đăng mới
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Xử lý việc thêm landlord vào bài đăng
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        """
        Xử lý việc lưu thông tin người đăng bài sau khi thực hiện create()
        nó gắn người đăng bài chính là user hiện tại đang gửi request này
        """
        serializer.save(landlord=self.request.user)  # Gán landlord là user hiện tại

class RoomSeekingPostViewSet(viewsets.ViewSet, generics.GenericAPIView):
    queryset = RoomSeekingPost.objects.filter(active=True)
    serializer_class = RoomSeekingPostSerializer
    pagination_class = PostPagination
    page_site=10
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated,IsTenant]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]
    
    @action(methods=['post','get'],detail=False,url_path="roomseekingpost")
    def roomseeking(self,request):
        if request.method.__eq__("POST"):
            serializer = RoomSeekingPostSerializer(
                data=request.data,
                context={'request':request}
            )
            if serializer.is_valid():
                room_seeking_post= serializer.save()
                return Response(RoomSeekingPostSerializer(room_seeking_post,context={'request':request}).data,status.HTTP_201_CREATED)
        elif request.method.__eq__("GET"):
            room_seeking_post = self.get_queryset()
            serializer = RoomSeekingPostSerializer(room_seeking_post,many=True)
            return Response(serializer.data)