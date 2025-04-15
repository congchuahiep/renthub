from rest_framework import serializers
from .models import Comment,CommentPost
from posts.models import RentalPost,RoomSeekingPost

class CommentSerializer(serializers.ModelSerializer):
    reply_to = serializers.IntegerField(required=False, write_only=True)

    class Meta:
        model = Comment
        fields = ["id", "content", "created_date", "user", "post", "reply_to"]
        read_only_fields = ["id", "created_date", "user", "post"]

    def get_user_display(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()

    def to_representation(self, instance):
        data = {
            "id": instance.id,
            "content": instance.content,
            "created_date": instance.created_date,
            "user": {
                "id": instance.user.id,
                "full_name": f"{instance.user.first_name} {instance.user.last_name}".strip()
            },
            "reply_to": instance.reply_to.id if instance.reply_to else None
        }

        if instance.reply_to is None:
            replies = instance.replies.all().select_related("user").select_related("user").order_by("created_date")
            data["replies"] = [
                {
                    "id": reply.id,
                    "content": reply.content,
                    "created_date": reply.created_date,
                    "user": {
                        "id": reply.user.id,
                        "username": reply.user.username,
                        "full_name": f"{reply.user.first_name} {reply.user.last_name}".strip()
                    },
                    "reply_to": instance.id
                }
                for reply in replies
            ]

        return data
    
    def validate(self, attrs):
        request = self.context.get("request")
        post_id = self.context.get("post_id")
        reply_to = self.context.get("reply_to")

        if not post_id:
            raise serializers.ValidationError("Không lấy được id bài viết")
        
        # Kiểm tra và xử lý reply_to
        if reply_to == 0:
            reply_to = None
        elif reply_to is not None:
            try:
                reply_to = Comment.objects.get(pk=reply_to)
            except Comment.DoesNotExist:
                raise serializers.ValidationError("Không tìm thấy bình luận gốc để trả lời")

        user = request.user

        # Kiểm tra bài viết và quyền truy cập
        try:
            post = RentalPost.objects.get(pk=post_id)
            if user.user_type == "LR":
                raise serializers.ValidationError("Người dùng không hợp lệ với bài đăng này")
        except RentalPost.DoesNotExist:
            try:
                post = RoomSeekingPost.objects.get(pk=post_id)
                if user.user_type == "TN":
                    raise serializers.ValidationError("Người dùng không hợp lệ với bài đăng này")
            except RoomSeekingPost.DoesNotExist:
                raise serializers.ValidationError("Bài viết không tồn tại")

        # Lấy hoặc tạo CommentPost
        try:
            comment_post = CommentPost.objects.get(pk=post_id)
        except CommentPost.DoesNotExist:
            raise serializers.ValidationError("Không tìm thấy CommentPost cho bài viết này")

        # Lưu CommentPost và reply_to vào context
        self.context["comment_post"] = comment_post
        self.context["reply_to"] = reply_to

        return attrs    
    
    def create(self, validated_data):
        return Comment.objects.create(
            user=self.context['request'].user,
            post=self.context['comment_post'],  # Sử dụng comment_post từ context
            reply_to=self.context['reply_to'],  # Sử dụng reply_to từ context
            content=validated_data['content']
        )
