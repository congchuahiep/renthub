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
        reply_to_id = self.context.get("reply_to")

        if not post_id:
            raise serializers.ValidationError("Không lấy được id bài viết")

        reply_to = None
        if reply_to_id is not None:
            if reply_to_id == 0:
                reply_to = None
            else:
                try:
                    reply_to = Comment.objects.get(pk=reply_to_id)
                except Comment.DoesNotExist:
                    raise serializers.ValidationError("Không tìm thấy bình luận gốc để trả lời")

        user = request.user
        if not user.is_authenticated:
            raise serializers.ValidationError("Bạn cần đăng nhập để bình luận.")

        post = None
        comment_post = None
        try:
            post = RentalPost.objects.get(pk=post_id)
            if hasattr(user, 'user_type') and user.user_type == "LR":
                raise serializers.ValidationError("Người dùng không hợp lệ để bình luận trên bài đăng cho thuê.")
            comment_post = post.comment_post
        except RentalPost.DoesNotExist:
            try:
                post = RoomSeekingPost.objects.get(pk=post_id)
                if hasattr(user, 'user_type') and user.user_type == "TN":
                    raise serializers.ValidationError("Người dùng không hợp lệ để bình luận trên bài đăng tìm phòng.")
                comment_post = post.comment_post
            except RoomSeekingPost.DoesNotExist:
                raise serializers.ValidationError("Bài viết không tồn tại")

        if not comment_post:
            raise serializers.ValidationError("Bài viết chưa có comment_post.")

        self.context["comment_post"] = comment_post
        self.context["reply_to"] = reply_to

        return attrs
    
    def create(self, validated_data):
        return Comment.objects.create(
            user=self.context['request'].user,
            post=self.context['comment_post'],  
            reply_to=self.context['reply_to'],  
            content=validated_data['content']
        )
