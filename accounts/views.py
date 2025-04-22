from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from accounts.serializers import LandlordRegistrationSerializer, UserSerializer
from utils.choices import UserType

User = get_user_model()

# Create your views here.
class UserViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    # parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ["get_current_user"]:
            return [permissions.IsAuthenticated()]

        # other action can be used by anyone
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.action in ["landlord_register"]:
            return LandlordRegistrationSerializer

        return super().get_serializer_class()

    @action(methods=['get'], detail=False, url_path="current-user")
    def get_current_user(self, request):
        user = request.user
        return Response(self.get_serializer(user).data)

    @action(methods=['post'], detail=False, url_path="landlord-register")
    def landlord_register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Vì serializer trả về loại dữ liệu hơi lạ nên ở đây ta
            # xử lý phản hồi thế này
            result = serializer.save()

            response_data = {
                'message': 'Đăng ký thành công. Tài khoản của bạn sẽ được kích hoạt sau khi dãy trọ được xét duyệt.',
                'user': UserSerializer(result['user']).data,
                'property': {
                    'id': result['property'].id,
                    'name': result['property'].name,
                    'province': result['property'].province,
                    'district': result['property'].district,
                    'address': result['property'].address,
                    'status': result['property'].status
                }
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
