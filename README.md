1. Tạo tệp `.env`
2. Điền các thông tin sau
    ```
    DB_NAME=<database_name>
    DB_HOST=<ip_database>
    DB_PORT=<database_host>
    DB_USER=<database_user>
    DB_PASSWORD=<user_passwork>
    ```
3. Tạo môi trường ảo bằng câu lệnh 
    ```
    python -m venv venv
    ```
4. Cài đặt thư viện phụ thuộc
    ```
    pip install -r requirements.txt
    ```
5. Chạy ứng dụng
    ```
    python manage.py runserver
    ```