from django.urls import path
from admin_site.site import admin_site

urlpatterns = [
    path('admin/', admin_site.urls),
]
