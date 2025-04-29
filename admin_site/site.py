from unfold.sites import UnfoldAdminSite

class RentHubAdminSite(UnfoldAdminSite):
    site_header = "RentHub Admin"
    site_title = "RentHub Admin Portal"
    index_title = "Welcome to RentHub Admin Portal"


renthub_admin_site = RentHubAdminSite(name="renthub_admin")
"""
`renthub_admin_site` đại diện cho trang quản trị của RentHub.

Để có thể đăng ký các model vào admin site,
ta sử dụng phương thức `.register()`.

Ví dụ: Đăng ký model `User` vào trang quản trị
```python
from admin_site.site import renthub_admin_site

renthub_admin_site.register(User)
```
"""
