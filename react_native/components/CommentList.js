import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
	ActivityIndicator,
	Avatar,
	Button,
	IconButton,
	Text,
	TextInput,
	useTheme,
} from "react-native-paper";
import { useAuth } from "../config/auth";
import useStyle from "../styles/useStyle";
import Comment from "./Comment";
import Apis from "../config/Apis";

const CommentsList = ({
	commentData,
	setCommentData,
	onCommentPost,
	onCommentReply,
	loadRepliesComment,
}) => {
	const theme = useTheme();
	const style = useStyle();

	const { results: comments, next } = commentData;

	const { user } = useAuth();

	const [newComment, setNewComment] = useState("");
	const [loadingMoreComments, setLoadingMoreComment] = useState(false);

	const loadMoreComments = async () => {
		if (!commentData.next) return;

		try {
			setLoadingMoreComment(true);
			const res = await Apis.get(commentData.next);
			setCommentData((prevData) => ({
				results: [...(prevData.results || []), ...res.data.results],
				next: res.data.next,
			}));
		} catch (ex) {
			console.error("Lỗi khi tải thêm bình luận:", ex);
		} finally {
			setLoadingMoreComment(false);
		}
	};

	const handleCommentPost = async () => {
		if (!newComment.trim()) return;
		await onCommentPost(newComment.trim());
		setNewComment("");
	};

	const handleReplySubmit = async (commentId, content) => {
		await onCommentReply(commentId, content);
	};

	return (
		<View style={{ padding: 16 }}>
			<Text
				style={[
					style.title_small,
					{ color: theme.colors.primary, marginBottom: 8 },
				]}
			>
				Bình luận
			</Text>

			{/* Comment Input */}
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
					marginBottom: 16,
					gap: 8,
				}}
			>
				{user?.avatar ? (
					<Avatar.Image size={42} source={{ uri: user?.avatar }} />
				) : (
					<Avatar.Text label="?" size={42} />
				)}
				<TextInput
					label={"Bình luận của bạn..."}
					value={newComment}
					style={{ flex: 1 }}
					onChangeText={setNewComment}
					disabled={!user}
					multiline
					mode="outlined"
				/>
				<IconButton
					mode="contained"
					icon="send"
					disabled={!user}
					onPress={handleCommentPost}
					style={{ margin: 0, borderRadius: 16 }}
				/>
			</View>

				{comments && Array.isArray(comments) && comments.length > 0 ? (
					comments.map((cmt) => (
						<Comment
							key={cmt.id}
							comment={cmt}
							onReplySubmit={handleReplySubmit}
							loadRepliesComment={loadRepliesComment}
						/>
					))
				) : (
					<Text>Không có bình luận nào</Text>
				)}

			{next && (
				<Button mode="contained-tonal" onPress={loadMoreComments} loading={loadingMoreComments}>
					Tải thêm bình luận
				</Button>
			)}
		</View>
	);
};

export default CommentsList;
