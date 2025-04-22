from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Property
from utils.choices import PropertyStatus, UserType

@receiver(pre_save, sender=Property)
def handle_property_and_landlord_approval(sender, instance, **kwargs):
    """
    Signal này chịu trách nhiệm kiểm tra và cập nhật trạng thái của dãy trọ đầu tiên,
    đồng thời kích hoạt hoặc từ chối tài khoản chủ trọ dựa trên kết quả xét duyệt.

    Ta có decorator @receiver(pre_save, sender=Property) tức:
        - `pre_save`: Tín hiệu được kích hoạt trước khi lưu model vào cơ sở dữ liệu.
        - `sender=Property`: Nguồn phát signal là model `Property`.

    Tức:
        - Quản trị duyệt property -> kích hoạt `handle_property_approval`
        - handle_property_approval -> kích hoạt/từ chối kích hoạt tài khoản chủ trọ
    """
    try:
        # Lấy thông tin property khi chưa cập nhật
        old_instance = Property.objects.get(pk=instance.pk)

        # Chỉ xử lý khi thuộc tính `status` thay đổi
        if old_instance.status == instance.status:
            return

        # Lấy thông tin chủ trọ
        owner = instance.owner

        # Lấy tổng số property của chủ trọ
        if owner and not owner.is_active and owner.user_type == UserType.LANDLORD:
            properties_count = Property.objects.filter(owner=owner).count()

            # Kiểm tra xem đây có phải là property đầu tiên của chủ trọ không
            if properties_count == 1:
                if instance.status == PropertyStatus.APPROVED:
                    # Kích hoạt tài khoản chủ trọ
                    owner.is_active = True
                    owner.save()
                elif instance.status == PropertyStatus.REJECTED:
                    # TODO: Gửi email thông báo đến chủ trọ
                    # TODO: Gửi email thông báo đến quản trị viên

                    # Tắt kích hoạt tài khoản chủ trọ
                    owner.is_active = False
                    owner.save()

    except Property.DoesNotExist:
        # Đây là property mới, không cần xử lý
        pass
