from django.contrib.admin import AdminSite

class RentHubAdminSite(AdminSite):
    site_header = "RentHub Admin"
    site_title = "RentHub Admin Portal"
    index_title = "Welcome to RentHub Admin Portal"


admin_site = RentHubAdminSite(name="renthub_admin")
"""
`admin_site` đại diện cho trang quản trị của RentHub.

Để có thể đăng ký các model vào admin site,
ta sử dụng phương thức register().

Ví dụ: Đăng ký model User vào trang quản trị
`admin_site.register(User)`
"""
