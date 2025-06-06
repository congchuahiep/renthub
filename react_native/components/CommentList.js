import { useState } from "react";
import { FlatList, View } from "react-native";
import {
	Avatar,
	Text,
	TextInput,
	Button,
	useTheme,
	Icon,
	IconButton,
} from "react-native-paper";
import Comment from "./Comment";
import useStyle from "../styles/useStyle";
import { useAuth } from "../config/auth";

const CommentsList = ({
	comments,
	onCommentPost,
	onCommentReply,
	loadRepliesComment,
}) => {
	const theme = useTheme();
	const style = useStyle();

	const { user } = useAuth();

	const [newComment, setNewComment] = useState("");

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
		</View>
	);
};

export default CommentsList;
