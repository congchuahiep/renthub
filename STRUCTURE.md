1. **accounts** (Quản lý người dùng):
- Models: User
- Xử lý authentication, authorization
- Quản lý profile người dùng
- Permissions và Groups

2. **posts** (Quản lý bài đăng):
- Models: RentalPost, RoomSeekingPost, Utilities
- Xử lý CRUD cho bài đăng thuê/cho thuê
- Tìm kiếm và lọc bài đăng
- Quản lý trạng thái bài đăng

3. **properties** (Quản lý nhà trọ):
- Models: BoardingHouse
- Quản lý thông tin nhà trọ
- Xử lý xét duyệt nhà trọ
- Thống kê về nhà trọ

4. **comments** (Quản lý bình luận):
- Models: Comment, CommentPost
- Xử lý CRUD bình luận
- Quản lý phản hồi bình luận

5. **messages** (Nhắn tin):
- Models: Conversation, Message
- Chat realtime
- Thông báo tin nhắn
- Lịch sử chat

6. **media** (Quản lý media):
- Models: Image, ImageRelation
- Upload và quản lý ảnh
- Tích hợp Cloudinary
- Xử lý media
