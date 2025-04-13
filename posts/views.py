from rest_framework import generics, viewsets

from posts.models import RentalPost
from posts.paginators import PostPagination
from posts.serializers import RentalPostSerializer


# Create your views here.
class RentalPostViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    # Sử dụng prefetch_related("utilities", "images") để tối ưu hóa câu truy vấn
    queryset = RentalPost.objects.prefetch_related("utilities", "images").filter(active=True)
    serializer_class = RentalPostSerializer
    pagination_class = PostPagination
    page_size = 10
