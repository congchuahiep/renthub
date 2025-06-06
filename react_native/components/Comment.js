// components/Comment.jsx
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import {
	Avatar,
	Text,
	TextInput,
	Button,
	useTheme,
	ActivityIndicator,
} from "react-native-paper";
import { getRelativeTime } from "../utils/datetime";

const Comment = ({ comment, onReplySubmit, loadRepliesComment }) => {
	const theme = useTheme();

	const [isRepliesOpen, setIsRepliesOpen] = useState(false);
	const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);

	const [repliesLoading, setRepliesLoading] = useState(false);
	const [replyContent, setReplyContent] = useState("");
	const [replies, setReplies] = useState([]);

	const handleToggleReplies = async () => {
		setRepliesLoading(true);
		if (!isRepliesOpen) {
			const replies = await loadRepliesComment(comment.id);
			console.log("Replies for comment:", comment.id, replies);
			setReplies(replies);
		}
		setRepliesLoading(false);
		setIsRepliesOpen(!isRepliesOpen);
	};

	const handleToggleReplyInput = () => {
		setIsReplyInputOpen(!isReplyInputOpen);
		setReplyContent(""); // Reset reply content when toggling
	};

	const handleReplySubmit = async () => {
		if (replyContent.trim()) {
			await onReplySubmit(comment.id, replyContent);
			setReplyContent("");
			setIsReplyInputOpen(false);
			// Refresh lại comment
			const replies = await loadRepliesComment(comment.id);
			setReplies(replies);
		}
	};

	return (
		<View
			style={{
				marginBottom: 12,
				backgroundColor: theme.colors.surface,
				borderRadius: 8,
			}}
		>
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					alignItems: "flex-start",
					gap: 8,
					marginBottom: 6,
					maxWidth: "100%",
				}}
			>
				<Avatar.Image
					size={36}
					source={comment.user?.avatar ? { uri: comment.user.avatar } : null}
				/>

				{/* Comment Content */}

				<View
					style={{
						backgroundColor: theme.colors.surfaceVariant,
						flex: 1,
						paddingVertical: 8,
						paddingHorizontal: 8,
						borderRadius: 8,
					}}
				>
					<Text
						style={{
							fontWeight: "bold",
							color: theme.colors.onSurface,
							fontSize: 16,
						}}
					>
						{comment.user?.name}
					</Text>

					<Text
						style={{
							color: theme.colors.onSurface,
							fontSize: 14,
						}}
					>
						{comment.content}
					</Text>
				</View>
			</View>

			{/* Action Buttons */}
			<View style={{ flexDirection: "row", gap: 12 }}>
				<View style={{ marginLeft: 44 }}>
					<Text style={{ color: theme.colors.onSurfaceDisabled }}>
						{getRelativeTime(comment.created_date)}
					</Text>
				</View>

				<TouchableOpacity
					onPress={handleToggleReplies}
					disabled={repliesLoading}
				>
					<Text
						style={{
							color: theme.colors.primary,
							fontWeight: "600",
						}}
					>
						{repliesLoading && (
							<>
								<ActivityIndicator size={14} />{" "}
							</>
						)}
						{isRepliesOpen ? "Ẩn phản hồi" : "Xem phản hồi"}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={handleToggleReplyInput}>
					<Text
						style={{
							color: theme.colors.primary,
							fontWeight: "600",
						}}
					>
						{isReplyInputOpen ? "Hủy" : "Trả lời"}
					</Text>
				</TouchableOpacity>
			</View>

			{/* Replies Section */}
			{isRepliesOpen && (
				<View style={{ marginLeft: 20, marginTop: 8 }}>
					{replies && replies.length > 0 ? (
						replies.map((reply) => (
							<View
								key={reply.id}
								style={{
									flex: 1,
									flexDirection: "row",
									alignItems: "flex-start",
									gap: 8,
									marginBottom: 6,
									maxWidth: "100%",
								}}
							>
								<Avatar.Image
									size={36}
									source={
										reply.user?.avatar ? { uri: reply.user.avatar } : null
									}
								/>
								{/* Reply omment Content */}
								<View
									style={{
										backgroundColor: theme.colors.surfaceDisabled,
										flex: 1,
										paddingVertical: 8,
										paddingHorizontal: 8,
										borderRadius: 8,
									}}
								>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
										}}
									>
										<Text
											style={{
												fontWeight: "bold",
												color: theme.colors.onSurface,
												fontSize: 16,
											}}
										>
											{reply.user?.name}
										</Text>
										<Text style={{ color: theme.colors.onSurfaceDisabled, fontSize: 12 }}>
											{getRelativeTime(reply.created_date)}
										</Text>
									</View>

									<Text
										style={{
											color: theme.colors.onSurface,
											fontSize: 14,
										}}
									>
										{reply.content}
									</Text>
								</View>
							</View>
						))
					) : (
						<Text
							style={{
								marginLeft: 32,
								marginBottom: 8,
								fontStyle: "italic",
								color: theme.colors.onSurfaceDisabled,
							}}
						>
							Không có phản hồi nào
						</Text>
					)}

					{/* Reply Input */}
					{isReplyInputOpen && (
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginTop: 2,
							}}
						>
							<TextInput
								mode="outlined"
								placeholder="Nhập phản hồi..."
								style={{ flex: 1, height: 48 }}
								value={replyContent}
								onChangeText={setReplyContent}
							/>
							<Button onPress={handleReplySubmit}>Gửi</Button>
						</View>
					)}
				</View>
			)}
		</View>
	);
};

export default Comment;
