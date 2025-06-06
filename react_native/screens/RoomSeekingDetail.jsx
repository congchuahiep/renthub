import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { use, useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	Avatar,
	Button,
	Card,
	Icon,
	TextInput,
	useTheme,
} from "react-native-paper";
import {
	default as Apis,
	authApis,
	default as axiosInstance,
	endpoints,
} from "../config/Apis";
import useStyle from "../styles/useStyle";
import { toVietNamDong } from "../utils/currency";
import { formatDate, getRelativeTime } from "../utils/datetime";
import CommentsList from "../components/CommentList";

const RoomSeekingDetail = ({ route }) => {
	const theme = useTheme();
	const style = useStyle();

	const [roomSeeking, setRoomSeeking] = useState(null);
	const [loading, setLoading] = useState(false);
	const [comments, setComments] = useState();

	const { postIntanceId } = route?.params;

	const loadComment = async () => {
		try {
			const res = await Apis.get(
				endpoints["roomseeking-comments"](postIntanceId)
			);
			console.log(res.data);
			setComments(res.data.results);
		} catch (ex) {
			console.log(ex);
		}
	};

	const loadRepliesComment = async (commentId) => {
		try {
			const res = await Apis.get(
				endpoints["roomseeking-comments-replies"](postIntanceId, commentId)
			);

			return res.data;
		} catch (ex) {
			console.log(ex);
			return null;
		}
	};

	const handleCommentPost = async (newComment) => {
		const token = await AsyncStorage.getItem("token");
		try {
			const res = await authApis(token).post(
				endpoints["roomseeking-comments"](postIntanceId),
				{
					content: newComment.trim(),
				}
			);
			console.log("Đã gửi bình luận:", res.data);
		} catch (ex) {
			console.log("Lỗi gửi bình luận:", ex);
		} finally {
			loadComment();
		}
	};

	const handleCommentReply = async (commentId, replyContent) => {
		const token = await AsyncStorage.getItem("token");
		console.log("commentId:", commentId);

		try {
			const res = await authApis(token).post(
				endpoints["roomseeking-comments"](postIntanceId),
				{
					content: replyContent.trim(),
					reply_to: commentId,
				}
			);
			console.log(res.data);
		} catch (ex) {
			console.log(ex);
		} finally {
			loadRepliesComment(commentId);
		}
	};

	const loadRoomSeekingPost = async () => {
		try {
			setLoading(true);
			console.log("ID: ", postIntanceId);
			const res = await axiosInstance.get(
				endpoints.roomseekingsDetails(postIntanceId)
			);
			console.log(res.data);
			setRoomSeeking(res.data);
			console.log(roomSeeking);
		} catch (ex) {
			console.log(ex);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		console.log(postIntanceId);
		loadRoomSeekingPost();
	}, []);

	useEffect(() => {
		loadComment();
	}, [roomSeeking]);

	if (!postIntanceId) {
		return <Text>Không tìm thấy thông tin bài đăng</Text>;
	}

	return (
		<ScrollView style={[style.container]}>
			{loading ? (
				<Text>Đang tải dữ liệu</Text>
			) : roomSeeking ? (
				<>
					{/* Tiêu đề và nội dung */}
					<Card style={style.card}>
						{/* <Card.Title
                            title={roomSeeking.title}
                            titleStyle={[style.title_big, { color: theme.colors.primary }]}
                        /> */}
						<Card.Title
							title="Thông tin bài đăng"
							titleStyle={[style.title_big, { color: theme.colors.primary }]}
						/>
						<Card.Content>
							<Text style={[style.content, { color: theme.colors.secondary }]}>
								{roomSeeking.content}
							</Text>
						</Card.Content>
					</Card>

					{/* Thời gian */}
					<Card style={style.card}>
						<Card.Title title="Thời gian" titleStyle={style.title_small} />
						<Card.Content>
							<View style={{ flexDirection: "column", gap: 8 }}>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Icon
										source="calendar-range"
										size={20}
										color={theme.colors.secondary}
									/>
									<Text
										style={{ marginLeft: 6, color: theme.colors.secondary }}
									>
										Đăng tải: {getRelativeTime(roomSeeking.created_date)}
									</Text>
								</View>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Icon
										source="timer-sand"
										size={20}
										color={theme.colors.secondary}
									/>
									<Text
										style={{ marginLeft: 6, color: theme.colors.secondary }}
									>
										Hết hạn: {formatDate(roomSeeking.expired_date)}
									</Text>
								</View>
							</View>
						</Card.Content>
					</Card>

					{/* Khu vực */}
					<Card style={style.card}>
						<Card.Title title="Khu vực" titleStyle={style.title_small} />
						<Card.Content>
							<Text style={[style.content, { color: theme.colors.secondary }]}>
								{roomSeeking.position}, {roomSeeking.district},{" "}
								{roomSeeking.province}
							</Text>
						</Card.Content>
					</Card>

					{/* Yêu cầu */}
					<Card style={style.card}>
						<Card.Title title="Yêu cầu" titleStyle={style.title_small} />
						<Card.Content>
							<View style={{ flexDirection: "column", gap: 8 }}>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Icon
										source="square-rounded-outline"
										size={16}
										color={theme.colors.primary}
									/>
									<Text
										style={{ marginLeft: 6, color: theme.colors.secondary }}
									>
										Diện tích: {roomSeeking.area} m²
									</Text>
								</View>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										color: theme.colors.secondary,
									}}
								>
									<Icon
										source="account-group-outline"
										size={20}
										color={theme.colors.primary}
									/>
									<Text
										style={{ marginLeft: 6, color: theme.colors.secondary }}
									>
										Giới hạn: {roomSeeking.limit_person} người
									</Text>
								</View>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Icon
										source="cash-multiple"
										size={20}
										color={theme.colors.primary}
									/>
									<Text
										style={{ marginLeft: 6, color: theme.colors.secondary }}
									>
										{roomSeeking.price_min && roomSeeking.price_max
											? `Giá cả: ${toVietNamDong(
													roomSeeking.price_min
											  )} - ${toVietNamDong(roomSeeking.price_max)}`
											: "Không yêu cầu "}
									</Text>
								</View>
							</View>
						</Card.Content>
					</Card>
				</>
			) : (
				<Text>Đang tải dữ liệu...</Text>
			)}

			<Card style={[style.card, { flex: 1 }]}>
				<CommentsList
					comments={comments}
					loading={loading}
					onCommentPost={handleCommentPost}
					onCommentReply={handleCommentReply}
					loadRepliesComment={loadRepliesComment}
					loadComments={loadComment}
				/>
			</Card>
		</ScrollView>
	);
};

export default RoomSeekingDetail;
