from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, viewsets,parsers
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import  Follow
from django.db.models import Q
from accounts.serializers import LandlordRegistrationSerializer, UserSerializer, FollowSerializer
from . import serializers
User = get_user_model()

# Create your views here.
class UserViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser,parsers.JSONParser]

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
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FollowViewSet(viewsets.ViewSet,generics.ListAPIView):
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        User = self.request.user
        if User.user_type == 'LR':
            return Follow.objects.filter(followee = User)       
        return Follow.objects.filter(follower = User)
    
    @action(methods=['get'],detail=False,url_path="get_follow")
    def follow_get(self,request):
        if request.method.__eq__("GET"):
            user=request.user
            follow = Follow.objects.filter(Q(follower=user)|Q(followee=user))
            serializer = serializers.FollowSerializer(follow,many=True,context={'request':request}) 
            return Response(serializer.data)     
    @action(methods=['post'],detail=True,url_name="follow")
    def follow_add(self,request,pk):
        if request.method.__eq__("POST"):
            if not pk:
                return Response({"error": "Followee ID is required in the URL."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                followee = User.objects.get(pk=pk)
            except User.DoesNotExist:
                return Response({"error": f"User with id {pk} not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = serializers.FollowSerializer(
                data={},  # Không cần truyền dữ liệu vì follower và followee được xử lý trong serializer
                context={'request': request, 'followee': followee}
            )
            serializer.is_valid(raise_exception=True)
            follow = serializer.save()
            return Response(serializers.FollowSerializer(follow, context={'request': request}).data, status=status.HTTP_201_CREATED)
                    
