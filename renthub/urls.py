"""
URL configuration for renthub project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import debug_toolbar
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Schema cho Swagger API
schema_view = get_schema_view(
    openapi.Info(
        title="Renthub API",
        default_version='v1',
        description="Các API công khai của Renthub",
        contact=openapi.Contact(email="congchuahiep@gmail.com"),
        license=openapi.License(name="Trần Hoàng Hiệp@2025"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


# Các API của cả dự án Renthub
urlpatterns = [
    # Các API chính của dự án Renthub
    path("admin/", include('admin_site.urls')),
    path('', include('chats.urls')), # chats/
    path('', include('posts.urls')), # rentals/
    path('', include('comments.urls')), # rentals/
    path('', include('accounts.urls')), # rentals/

    # Tests
    path('test/', include('testing.urls')),

    # Swagger API
    re_path(
        r'^swagger(?P<format>\.json|\.yaml)$',
        schema_view.without_ui(cache_timeout=0),
        name='schema-json'
    ),
    re_path(
        r'^swagger/$',
        schema_view.with_ui('swagger', cache_timeout=0),
        name='schema-swagger-ui'
    ),
    re_path(
        r'^redoc/$',
        schema_view.with_ui('redoc', cache_timeout=0),
        name='schema-redoc'
    ),
    path('o/', include('oauth2_provider.urls',
                       namespace='oauth2_provider')),

    #Debug toolbar
    path('__debug__/', include(debug_toolbar.urls)),

    # JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
