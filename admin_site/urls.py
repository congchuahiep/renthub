from django.urls import path
from admin_site.site import renthub_admin_site



urlpatterns = [
    path('', renthub_admin_site.urls),  
]
