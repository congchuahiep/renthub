from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, viewsets, parsers
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Follow
from django.db.models import Q
from utils.choices import UserType
from accounts.serializers import (
    LandlordRegistrationSerializer,
    TenantRegisterSerializer,
    UserSerializer,
    FollowSerializer,
)
from . import serializers
from .perms import IsFollower

User = get_user_model()


# Create your views here.
class UserViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_permissions(self):
        if self.action in ["get_current_user"]:
            return [permissions.IsAuthenticated()]

        # other action can be used by anyone
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.action in ["landlord_register"]:
            return LandlordRegistrationSerializer
        if self.action in ["tenant_register"]:
            return TenantRegisterSerializer

        return super().get_serializer_class()

    @action(methods=["get"], detail=False, url_path="current-user")
    def get_current_user(self, request):
        user = request.user
        return Response(self.get_serializer(user).data)

    @action(methods=["post"], detail=False, url_path="landlord-register")
    def landlord_register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # TODO: Hoàn thiện chức năng đăng ký người dùng thuê nhà
    # [] Tạo Serializer
    @action(methods=["post"], detail=False, url_path="tenant-register")
    def tenant_register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FollowViewSet(viewsets.GenericViewSet):
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ["destroy"]:
            return [IsFollower()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        """
        Trả về danh sách Follow dựa trên người dùng hiện tại hoặc hành động cụ thể.
        """
        user = self.request.user
        if self.action == "follow_get":
            pk = self.kwargs.get("pk")
            if not pk:
                return Follow.objects.none()
            try:
                target_user = User.objects.get(pk=pk)
            except User.DoesNotExist:
                return Follow.objects.none()
            if target_user.user_type == UserType.LANDLORD:
                return Follow.objects.filter(followee=target_user)
            elif target_user.user_type == UserType.TENANT:
                return Follow.objects.filter(follower=target_user)
            return Follow.objects.none()
        if user.user_type == UserType.LANDLORD:
            return Follow.objects.filter(followee=user)
        return Follow.objects.filter(follower=user)

    @action(methods=["get", "post"], detail=True, url_path="follow")
    def follow(self, request, pk):
        if request.method.__eq__("GET"):
            user = User.objects.get(pk=pk)
            follow = Follow.objects.filter(Q(follower=user) | Q(followee=user))
            serializer = serializers.FollowSerializer(
                follow, many=True, context={"request": request}
            )
            return Response(serializer.data)

        else:
            if not pk:
                return Response(
                    {"error": "Followee ID is required in the URL."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                followee = User.objects.get(pk=pk)
            except User.DoesNotExist:
                return Response(
                    {"error": f"User with id {pk} not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            serializer = serializers.FollowSerializer(
                data={},  # Không cần truyền dữ liệu vì follower và followee được xử lý trong serializer
                context={"request": request, "followee": followee},
            )
            serializer.is_valid(raise_exception=True)
            follow = serializer.save()
            return Response(
                serializers.FollowSerializer(follow, context={"request": request}).data,
                status=status.HTTP_201_CREATED,
            )

    @action(detail=True, methods=["get"], url_path="is-following")
    def is_following(self, request, pk=None):
        """
        Kiểm tra xem người dùng hiện tại có đang follow user `pk` không.
        """
        try:
            followee = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        is_following = Follow.objects.filter(
            follower=request.user,
            followee=followee,
            active=True,  # Nếu bạn dùng trường `active` để xác định follow đang bật
        ).exists()

        return Response({"is_following": is_following})

    @action(detail=True, methods=["delete"], url_path="follower")
    def delete_by_followee(self, request, pk=None):
        """
        Xóa bản ghi Follow mà người dùng hiện tại là follower và followee là người dùng được chỉ định.
        """
        try:
            followee = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {"detail": "Followee not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Lấy bản ghi Follow liên quan đến người dùng hiện tại và followee
        follows = Follow.objects.filter(follower=request.user, followee=followee)

        if not follows.exists():
            return Response(
                {
                    "detail": "No Follow records found for this followee and current user."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Xóa các bản ghi
        follows.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  # Không trả về nội dung
