import cloudinary.utils
from django.utils.safestring import mark_safe


def generate_image_url(public_id, transformations=""):
    '''
    Tạo URL cho ảnh cloudinary
    :param public_id: public_id của ảnh
    :param transformations: Các biến đổi ảnh
    :return: URL ảnh
    '''
    url, _ = cloudinary.utils.cloudinary_url(
        public_id,
        cloud_name=cloudinary.config().cloud_name,  # Lấy cloud_name từ config
        secure=True,  # Đảm bảo HTTPS
        transformation=transformations
    )
    return url


def get_cloudinary_image(public_id, transformations=""):
    '''
    Hiển thị ảnh từ cloudinary
    :param public_id: id của ảnh
    :param transformations: Các biến đổi ảnh
    :return: Ảnh
    '''
    image_url = generate_image_url(public_id, transformations)

    return mark_safe(f"<img src='{image_url}' />")
