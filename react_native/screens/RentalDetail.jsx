import { GoogleMaps } from "expo-maps";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from "react-native";
import {
	ActivityIndicator,
	AnimatedFAB,
	Avatar,
	Button,
	Card,
	Icon,
	Text,
	TextInput,
	useTheme,
} from "react-native-paper";
import Carousel from "../components/Carousel";
import Apis, { authApis, endpoints } from "../config/Apis";

import AsyncStorage from "@react-native-async-storage/async-storage";
import useStyle from "../styles/useStyle";
import { toVietNamDong } from "../utils/currency";
import { formatDate, getRelativeTime } from "../utils/datetime";

const RentalDetail = ({ route }) => {
	const theme = useTheme();
	const style = useStyle();

	const [isPhoneButtonExtended, setIsPhoneButtonExtended] = useState(true);
	const [loading, setLoading] = useState(false);

	const [rentalPost, setRentalPost] = useState();
	const [comments, setComments] = useState();
	const [repliesComment, setRepliesComment] = useState({});
	const [openReplies, setOpenReplies] = useState({});
	const [newComment, setNewComment] = useState("");
	const [newReplyComment, setNewReplyComment] = useState({});



	const { id } = route.params;

	const loadComment = async () => {
		try {
			const res = await Apis.get(endpoints["rental-comments"](id));
			console.log(res.data);
			setComments(res.data.results);

		} catch (ex) {
			console.log(ex);
		}
	};

	const loadRepliesComment = async (commentId) => {
		try {
			const res = await Apis.get(endpoints["rental-comments-replies"](id, commentId));
			console.log("Replies for comment:", commentId, res.data);
			if (Array.isArray(res.data) && res.data.length > 0) {
				setRepliesComment(prev => ({
					...prev,
					[commentId]: res.data,
				}));
			} else {
				setRepliesComment(prev => ({
					...prev,
					[commentId]: [], // vẫn set mảng rỗng để tránh lỗi undefined
				}));
			}
		} catch (ex) {
			console.log(ex);
		}
	};

	const CommentPost = async () => {
		if (!newComment.trim()) return; // không gửi bình luận rỗng

		const token = await AsyncStorage.getItem("token");
		try {
			const res = await authApis(token).post(endpoints["rental-comments"](id), {
				content: newComment.trim(),
			});
			console.log("Đã gửi bình luận:", res.data);
			setNewComment("");
		} catch (ex) {
			console.log("Lỗi gửi bình luận:", ex);
		} finally {
			loadComment();
		}
	};

	const CommentReply = async (commentId, replyContent) => {
		const token = await AsyncStorage.getItem("token");
		console.log('commentId:', commentId);

		try {
			const res = await authApis(token).post(endpoints["rental-comments"](id), {
				content: replyContent.trim(),
				reply_to: commentId,
			});
			console.log(res.data);
		} catch (ex) {
			console.log(ex);
		} finally {
			loadRepliesComment(commentId);
		}
	};





	// Khi trượt nút liên hệ sẽ thu nhỏ lại
	const onScroll = ({ nativeEvent }) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

		setIsPhoneButtonExtended(currentScrollPosition <= 0);
	};

	const loadRentalPost = async () => {
		setLoading(true);

		await Apis.get(endpoints["rental-details"](id))
			.then((res) => {
				console.log(res.data);
				setRentalPost(res.data);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
		loadComment();

	};

	useEffect(() => {
		loadRentalPost();

	}, []);

	return (
		<>
			<KeyboardAvoidingView
				behavior="padding"
				keyboardVerticalOffset={0}
				style={{ flex: 1, position: "relative" }}
			>
				{rentalPost ? (
					<>
						<ScrollView style={[style.container]} onScroll={onScroll}>
							{/* KHUNG XEM ẢNH */}
							<View
								style={[
									style.box_shadow,
									{
										marginTop: 16,
										marginBottom: 8,
										borderWidth: 2,
										borderRadius: 10,
										borderColor: theme.colors.secondary,
									},
								]}
							>
								<Carousel images={rentalPost.post.images} />
							</View>

							{/* TỰA ĐỀ */}
							<Card style={[style.card]}>
								<Card.Title
									title={rentalPost.title}
									titleStyle={[
										style.title_big,
										{ color: theme.colors.primary },
									]}
								/>
								<Card.Content style={{ color: theme.colors.secondary }}>
									<View
										style={{
											flex: 1,
											flexDirection: "row",
											alignItems: "flex-start",
											gap: 5,
											marginBottom: "6",
										}}
									>
										<Icon
											source="map-marker-outline"
											size={20}
											color={theme.colors.secondary}
											style={{}}
										/>
										<Text
											variant="bodyMedium"
											style={{ color: theme.colors.secondary, flexShrink: 1 }}
										>
											{rentalPost.property.address}, {rentalPost.property.ward},{" "}
											{rentalPost.property.district},{" "}
											{rentalPost.property.province}
										</Text>
									</View>
									<View
										style={{
											flex: 1,
											flexDirection: "row",
											alignItems: "flex-start",
											gap: 5,
											marginBottom: "6",
										}}
									>
										<Icon
											source="calendar-range"
											size={20}
											color={theme.colors.secondary}
										/>
										<Text
											style={{ color: theme.colors.secondary, flexShrink: 1 }}
										>
											Đăng tải: {getRelativeTime(rentalPost.created_date)}
										</Text>
									</View>
									<View
										style={{
											flex: 1,
											flexDirection: "row",
											alignItems: "flex-start",
											gap: 5,
											marginBottom: "6",
										}}
									>
										<Icon
											source="timer-sand"
											size={20}
											color={theme.colors.secondary}
										/>
										<Text
											style={{ color: theme.colors.secondary, flexShrink: 1 }}
										>
											Hết hạn: {formatDate(rentalPost.expired_date)}
										</Text>
									</View>
									<View
										style={{
											flex: 1,
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-around",
											marginLeft: 3,
											marginTop: 8,
										}}
									>
										<View
											style={{
												flex: 1,
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<Icon
												source={"bed-outline"}
												size={16}
												color={theme.colors.primary}
											/>
											<Text style={{ marginLeft: 3, marginRight: 16 }}>
												{rentalPost.number_of_bedrooms}
											</Text>
											<Icon
												source={"shower"}
												size={16}
												color={theme.colors.primary}
											/>
											<Text style={{ marginLeft: 3, marginRight: 16 }}>
												{rentalPost.number_of_bathrooms}
											</Text>
											<Icon
												source={"square-rounded-outline"}
												size={16}
												color={theme.colors.primary}
											/>
											<Text style={{ marginLeft: 3 }}>{rentalPost.area}m²</Text>
										</View>
										<Text
											style={{
												color: theme.colors.primary,
												fontWeight: 900,
												fontSize: 18,
											}}
										>
											{toVietNamDong(rentalPost.price)}
										</Text>
									</View>
								</Card.Content>
							</Card>

							{/* THÔNG TIN CHI TIẾT */}
							<Card style={[style.card]}>
								<Card.Content>
									<Text
										style={[
											style.title_small,
											{ color: theme.colors.primary, marginBottom: 5 },
										]}
									>
										Thông tin chi tiết
									</Text>
									<Text style={{ color: theme.colors.secondary }}>
										{rentalPost.content}
									</Text>
								</Card.Content>
							</Card>

							{/* THÔNG TIN DÃY TRỌ VÀ VỊ TRÍ DÃY TRỌ */}
							<Card style={[style.card, { height: 468 }]}>
								<Card.Content>
									<View style={{ height: 436 }}>
										<Text
											style={[
												style.title_small,
												{ color: theme.colors.primary, marginBottom: 5 },
											]}
										>
											Vị trí dãy trọ
										</Text>
										<Text
											style={{
												color: theme.colors.secondary,
												flexShrink: 1,
												marginBottom: 6,
											}}
										>
											{rentalPost.property.address}, {rentalPost.property.ward},{" "}
											{rentalPost.property.district},{" "}
											{rentalPost.property.province}
										</Text>
										<GoogleMaps.View
											style={{ flex: 1, borderRadius: 6, flexShrink: 1 }}
											cameraPosition={{
												coordinates: {
													latitude: rentalPost.property.latitude,
													longitude: rentalPost.property.longitude,
												},
												zoom: 15,
											}}
											markers={[
												{
													coordinates: {
														latitude: rentalPost.property.latitude,
														longitude: rentalPost.property.longitude,
													},
													title: rentalPost.title,
												},
											]}
											uiSettings={{
												myLocationButtonEnabled: false,
											}}
										/>
									</View>
								</Card.Content>
							</Card>

							{/* THÔNG TIN CHỦ ĐĂNG BÀI */}
							{/* TODO: Thêm nút follow */}
							<Card style={style.card}>
								<Card.Content>
									<Text
										style={[
											style.title_small,
											{ color: theme.colors.primary, marginBottom: 16 },
										]}
									>
										Thông tin liên hệ
									</Text>

									<View
										style={{
											flex: 1,
											flexDirection: "row",
											justifyContent: "center",
											alignItems: "center",
											gap: 24,
											marginBottom: 16,
										}}
									>
										<Avatar.Image
											source={{ uri: rentalPost.owner.avatar }}
											size={96}
										/>
										<View>
											<Text style={[style.title_small]}>
												{rentalPost.owner.last_name}{" "}
												{rentalPost.owner.first_name}
											</Text>
											<Text>{rentalPost.owner.email}</Text>
											<Text>{rentalPost.owner.phone_number}</Text>
										</View>
									</View>
								</Card.Content>
							</Card>

							{/* KHUNG BÌNH LUẬN */}
							{/* TODO: Triển khai bình luận bài đăng */}
							<Card style={style.card}>
								<Card.Content>
									<Text
										style={[
											style.title_small,
											{ color: theme.colors.primary, marginBottom: 5 },
										]}
									>
										Bình luận
									</Text>

									<View
										style={{
											flex: 1,
											flexDirection: "row",
											alignItems: "center",
											gap: 12,
											marginBottom: 16,
										}}
									>
										<Avatar.Text label="?" size={36} />
										<TextInput
											label={"Bình luận của bạn..."}
											value={newComment}
											onChangeText={setNewComment}
											style={{ flexGrow: 1 }}
											mode="outlined"
										/>
										<Button onPress={CommentPost}>Gửi</Button>
									</View>

									{Array.isArray(comments) && comments.length > 0 ? (
										comments.map((cmt) => (
											<View
												key={cmt.id}
												style={{
													marginBottom: 12,
													backgroundColor: theme.colors.surface, // nền theo theme
													padding: 12,
													borderRadius: 8,
													shadowColor: theme.dark ? "#000" : "#ccc",
													shadowOffset: { width: 0, height: 1 },
													shadowOpacity: 0.3,
													shadowRadius: 2,
													elevation: 2,
												}}
											>
												<View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
													<Avatar.Image size={36} source={cmt.user?.avatar ? { uri: cmt.user.avatar } : null} />
													<Text style={{ fontWeight: "bold", color: theme.colors.onSurface, fontSize: 16 }}>
														{cmt.user?.name}
													</Text>
												</View>
												<Text style={{ marginLeft: 44, color: theme.colors.onSurface, fontSize: 14, marginBottom: 6 }}>
													{cmt.content}
												</Text>
												<View style={{ flexDirection: "row" }}>
													<TouchableOpacity
														onPress={() => {
															if (openReplies[cmt.id]) {
																setOpenReplies(prev => ({ ...prev, [cmt.id]: false }));
															} else {
																if (!repliesComment[cmt.id]) {
																	loadRepliesComment(cmt.id);
																}
																setOpenReplies(prev => ({ ...prev, [cmt.id]: true }));
															}
														}}
													>
														<Text style={{ color: theme.colors.primary, fontWeight: "600", padding: 10 }}>
															{openReplies[cmt.id] ? 'Ẩn phản hồi' : 'Xem phản hồi'}
														</Text>
													</TouchableOpacity>

													<TouchableOpacity
														onPress={() => {
															setNewReplyComment(prev => {
																const isOpen = prev[cmt.id] !== undefined;
																if (isOpen) {
																	const updated = { ...prev };
																	delete updated[cmt.id]; // Ẩn ô phản hồi
																	return updated;
																} else {
																	return { ...prev, [cmt.id]: "" }; // Mở ô phản hồi trống
																}
															});
														}}
													>
														<Text style={{ color: theme.colors.primary, fontWeight: "600", padding: 10 }}>
															{newReplyComment[cmt.id] !== undefined ? "Hủy" : "Trả lời"}
														</Text>
													</TouchableOpacity>
												</View>

												{openReplies[cmt.id] && (
													<View style={{ marginLeft: 20, marginTop: 8 }}>
														{repliesComment[cmt.id] && repliesComment[cmt.id].length > 0 ? (
															repliesComment[cmt.id].map((reply) => (
																<View key={reply.id} style={{ marginBottom: 8 }}>
																	<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
																		<Avatar.Image
																			size={36}
																			source={reply.user?.avatar ? { uri: reply.user.avatar } : null}
																		/>
																		<Text style={{ fontWeight: "bold", color: theme.colors.onSurface }}>
																			{reply.user.name}
																		</Text>
																	</View>
																	<Text style={{ marginLeft: 44, color: theme.colors.onSurface }}>
																		{reply.content}
																	</Text>
																</View>
															))
														) : (
															<Text style={{ marginLeft: 4, fontStyle: "italic", color: theme.colors.onSurface }}>
																Không có phản hồi
															</Text>
														)}
														{newReplyComment[cmt.id] !== undefined && (
															<View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
																<TextInput
																	mode="outlined"
																	placeholder="Nhập phản hồi..."
																	style={{ flex: 1 }}
																	value={newReplyComment[cmt.id]}
																	onChangeText={(text) =>
																		setNewReplyComment((prev) => ({ ...prev, [cmt.id]: text }))
																	}
																/>
																<Button onPress={ () => {
																	CommentReply(cmt.id, newReplyComment[cmt.id]);
																	setNewReplyComment(prev => ({ ...prev, [cmt.id]: "" }));
																}}>
																	Gửi
																</Button>
															</View>
														)}
													</View>
												)}

											</View>
										))
									) : (
										<Text>Không có bình luận nào</Text>
									)}

								</Card.Content>
							</Card>

							<View style={{ height: 120 }} />

							{/* TODO: TRIỂN KHAI NÚT LIÊN HỆ */}
						</ScrollView>

						<AnimatedFAB
							icon={"phone"}
							label={"Liên hệ ngay"}
							extended={isPhoneButtonExtended}
							onPress={() => console.log("Pressed")}
							animateFrom={"right"}
							style={{ position: "absolute", bottom: 42, right: 24 }}
						/>
					</>
				) : (
					<ActivityIndicator
						size={48}
						style={{
							position: "absolute",
							bottom: 0,
							top: 0,
							right: 0,
							left: 0,
						}}
					/>
				)}
			</KeyboardAvoidingView>
		</>
	);
};

export default RentalDetail;
