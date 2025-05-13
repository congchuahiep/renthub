RentHub React Native
====================

Đây là phần Front-end của ứng dụng RentHub dành cho thiết bị di động.

TechStack
=========

- **`React Native`**: Framework chính cho ứng dụng
- **`AsyncStorage`**: Lưu trữ dữ liệu nhỏ và liên tục trên thiết bị. Các dữ liệu này thường là token đăng nhập, cấu hình ứng dụng (ngôn ngữ, chủ đề),...
- **`Native Stack Navigator`**: Quản lý điều hướng giữa các màn hình (screens)
- **`Axios`**: Cải thiện khả năng fetch dữ liệu
- **`react-native-maps`**: Tích hợp map (google map đối với android, apple map đối với apple) vào trong ứng dụng

### Theming

- [**`React Native Paper`**](https://callstack.github.io/react-native-paper/): Cải thiện giao diện mặc định hiện đại hơn
- [**`Expo Material 3 Theme`**](https://github.com/pchmn/expo-material3-theme): Tích hợp khả năng Material 3 Dynamic theme, giúp tự động chỉnh màu ứng dụng tuỳ theo màu mà thiết bị cài đặt _(Thư viện này không hoạt động trong Expo Go)_

Khởi tạo dự án
==============

Để có thể chạy được dự án react native, yêu cầu bạn cần phải chạy backend (phần django) trước. Ngoài ra bạn cũng cần một `Maps SDK for Android` Key để có thể đăng ký sử dụng các dịch vụ của `Google Map API`

### 1. Thiết lập biến môi trường

Tạo một tệp tên là `.env`, tệp này sẽ chứa các biến môi trường cần thiết lập cho chương trình. Ta điền các thông tin sau của biến môi trường như sau:

```ini
EXPO_PUBLIC_DJANGO_SERVER_URL=...
EXPO_PUBLIC_GOOGLE_MAP_API=...
```

### 2. Cài đặt thư viện phụ thuộc

Để cài đặt các thư viện phụ thuộc, bạn chỉ cần chạy lệnh sau:

```shell
npm install
```

Nếu bạn sử dụng `yarn`, `bun`, `pnpm`, hoặc bất kỳ công cụ quản lý gói nào khác, hãy chạy lệnh tương tự như `npm` để cài đặt các thư viện phụ thuộc
