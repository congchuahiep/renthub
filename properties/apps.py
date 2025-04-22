from django.apps import AppConfig


class PropertiesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'properties'

    def ready(self):
        """
        Đăng ký các signal cho ứng dụng properties:
            - Tự động duyệt tài khoản chủ trọ khi dãy trọ đầu tiên được duyệt
        """
        from properties import signals
