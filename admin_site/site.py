from unfold.sites import UnfoldAdminSite
from django.contrib import admin
from django.urls import path
from accounts.models import User
from django.db.models import Count
from django.template.response import TemplateResponse
from django.db.models.functions import TruncMonth, TruncQuarter, TruncYear
import json
from django.core.serializers.json import DjangoJSONEncoder
from accounts.models import UserType

class RentHubAdminSite(UnfoldAdminSite):
    site_header = "RentHub Admin"
    site_title = "RentHub Admin Portal"
    index_title = "Welcome to RentHub Admin Portal"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('renthub-stats/', self.admin_view(self.renthub_stats), name='renthub_stats'),
        ]
        return custom_urls + urls

    def renthub_stats(self, request):

    
                

        def get_grouped_stats_by_user_type(trunc_func, field_name):
            qs = User.objects.annotate(group=trunc_func('date_joined')) \
                .values('group', 'user_type') \
                .annotate(count=Count('id')) \
                .order_by('group', 'user_type')

            result = {}
            for item in qs:
                date = item['group'].strftime('%Y-%m-%d')
                user_type = item['user_type']
                count = item['count']
                if date not in result:
                    result[date] = {ut: 0 for ut in UserType.values}
                result[date][user_type] = count

            return [
                {
                    field_name: date,
                    **counts
                }
                for date, counts in result.items()
            ]

        monthly_stats = get_grouped_stats_by_user_type(TruncMonth, 'month')
        quarterly_stats = get_grouped_stats_by_user_type(TruncQuarter, 'quarter')
        yearly_stats = get_grouped_stats_by_user_type(TruncYear, 'year')



        return TemplateResponse(request, 'admin/stats.html', {
            'monthly_stats': json.dumps(monthly_stats, cls=DjangoJSONEncoder),
            'quarterly_stats': json.dumps(quarterly_stats, cls=DjangoJSONEncoder),
            'yearly_stats': json.dumps(yearly_stats, cls=DjangoJSONEncoder),

        })

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
