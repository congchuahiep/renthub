# from rest_framework import viewsets

from drf_yasg.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.routers import Response


class ProtectedView(APIView):
    """
    View này được bảo vệ bằng xác thực JWT.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'Bạn đã được xác thực!', 'user': str(request.user)})
