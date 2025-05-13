# RentHub

**RentHub** là một ứng dụng hỗ trợ tìm kiếm nhà trọ, cho phép người dùng đăng bài tìm kiếm trọ/tìm trọ. Với điểm nhấn là giao diện hiện đại, nhanh, nhẹ, nhiều tính năng hỗ trợ tìm trọ tiện lợi.

*Dự án này là phần bài tập lớn của môn "Các công nghệ lập trình hiện đại"*

# TechStack

- **`Django`**: Framework chính
- **`Django REST Framework`**: Cung cấp khả năng tạo REST API
- **`Django Unfold`**: Cải thiện giao diện trang Admin
- **`Django OAuth Tookit`**: Cung cấp khả năng tích hợp OAuth2
- **`Google Map API`**: Tích hợp khả năng hiển thị bản đồ, đổi địa chỉ thành toạ độ (kinh độ, vĩ độ)
- **`MySQL`**: Hệ quản trị cơ sở dữ liệu
- **`Cloudinary`**: Dịch vụ lưu trữ hình ảnh

### Deploy

Để deploy, ta cần phụ thuộc vào một số thư viện sau:

- **`Gunicorn`**: Cung cấp máy chủ WSGI , giúp chạy ứng dụng Django trong môi trường sản xuất

- **`WhiteNoise`**: Thư viện này giúp Django phục vụ các tệp tĩnh (CSS, JavaScript, hình ảnh) một cách hiệu quả mà không cần máy chủ web riêng như Nginx

# Khởi tạo dự án

Dự án này sử dụng `MySQL` làm hệ quản trị dữ liệu. Bạn cần cài đặt một hệ quản trị server `MySQL` trước khi tiến hành khởi tạo RentHub

Ngoài ra bạn cũng cần một `Google Map API` Key để có thể đăng ký sử dụng các dịch vụ của `Google Map API`

RentHub cũng sử dụng OAuth2, nếu bạn chưa đăng ký một ứng dụng OAuth2 nào, bạn có thể thiết lập chúng tại đường dẫn `/o/applications/` khi chạy ứng dụng

### 1. Tạo biến môi trường

Tạo một tệp tên là `.env`, tệp này sẽ chứa các biến môi trường cần thiết lập cho chương trình. Ta điền các thông tin sau của biến môi trường như sau:

```ini
DB_NAME=...
DB_HOST=...
DB_PORT=...
DB_USER=...
DB_PASSWORD=...

DJANGO_SECRET_KEY=...   ; Khoá bí mật của cả dự án, khoá này do bạn tự đặt

GOOGLE_MAPS_API_KEY=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

OATUH2_CLIENT_ID=...
OATUH2_CLIENT_SECRET=...
```

### 2. Cài đặt các thư viện phụ thuộc

Mở terminal. Tạo môi trường Python ảo bằng câu lệnh

```shell
python -m venv venv
```

Kích hoạt môi trường ảo và cài đặt các thư viện phụ thuộc bằng lệnh:

```shell
venv/Scripts/activate

pip install -r requirements.txt
```

### 3. Chạy migrate

Tiếp theo, bạn cần migrate để đồng bộ cấu trúc giữa Django Model và các bảng trong Database bằng câu lệnh sau:

```shell
python manage.py migrate
```

RentHub cũng cần cung cấp các dữ liệu về tỉnh/huyện/xã để hoạt động đúng cách. Dự án này có chứa một tệp là `seed/locations.sql`, cung cấp dữ liệu để seed cho tỉnh/huyện/xã. Việc của bạn là thực thi tệp này trong `MySQL`

Dữ liệu seed các tỉnh thành được cung cấp bởi: [vietnamese-provinces-database](https://github.com/ThangLeQuoc/vietnamese-provinces-database/tree/master)

### 4. Chạy Server

Sau khi đã hoàn tất các bước trên, bạn có thể chạy dự án bằng lệnh:

```shell
python manage.py runserver 0.0.0.0:8000
```