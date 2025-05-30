from rest_framework import mixins, viewsets,parsers
# from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from accounts.perms import IsLandlord
from properties.perms import IsPropertyOwner
from .models import PropertyImage

from . import serializers
from .models import Property


class PropertyViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin
):
    queryset = Property.objects.filter(active=True)
    serializer_class = serializers.PropertySerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    def get_permissions(self):
        if self.action == "create":
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
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Xử lý upload hình ảnh
        upload_images = request.data.getlist('upload_images', [])
        for image_file in upload_images:
            PropertyImage.objects.create(
                image=image_file, alt=f"Image for {instance.name}", property=instance
            )

        self.perform_update(serializer)
        return Response(serializer.data)
