from accounts.views import User
from properties.paginators import PropertyPaginator
from rest_framework import mixins, parsers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from accounts.perms import IsLandlord
from properties.perms import IsPropertyOwner

from . import serializers
from .models import Property, PropertyImage


class PropertyViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
):
    queryset = Property.objects.filter(active=True)
    serializer_class = serializers.PropertySerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    pagination_class = PropertyPaginator

    def get_permissions(self):
        if self.action in ["create", "my_properties"]:
            return [IsLandlord()]
        if self.action in ["destroy", "update", "partial_update"]:
            return [IsPropertyOwner()]

        return [AllowAny()]

    def perform_create(self, serializer):
        instance = serializer.save(owner=self.request.user)
        serializer.context["detail"] = (
            f"Property '{instance.name}' has been created successfully."
        )

    def update(self, request, *args, **kwargs):
        """
        Ghi đè phương thức update để xử lý upload hình ảnh.
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Xử lý upload hình ảnh
        upload_images = request.data.getlist("upload_images", [])
        for image_file in upload_images:
            PropertyImage.objects.create(
                image=image_file, alt=f"Image for {instance.name}", property=instance
            )

        self.perform_update(serializer)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        url_path="my-properties",
    )
    def my_properties(self, request):
        """
        Lấy danh sách property của user hiện tại
        """
        queryset = self.get_queryset().filter(owner=request.user, active=True)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        url_path="of-user/(?P<user_id>[^/.]+)",
    )
    def user_properties(self, request, user_id=None):
        """
        Lấy danh sách property của một user cụ thể.
        URL: /of-user/{user_id}/
        """
        try:
            queryset = self.get_queryset().filter(
                owner_id=user_id, active=True, status="approved"
            )
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        except User.DoesNotExist:
            return Response(
                {"detail": "Không tìm thấy người dùng này"},
                status=status.HTTP_404_NOT_FOUND,
            )
