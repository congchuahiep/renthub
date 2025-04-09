from django.contrib.admin import AdminSite

class RentHubAdminSite(AdminSite):
    site_header = "RentHub Admin"
    site_title = "RentHub Admin Portal"
    index_title = "Welcome to RentHub Admin Portal"

# Tạo instance của admin site
admin_site = RentHubAdminSite(name="renthub_admin")
