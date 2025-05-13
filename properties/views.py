from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny

from accounts.perms import IsLandlord
from properties.perms import IsPropertyOwner

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
