import { GoogleMaps } from "expo-maps";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import {
	ActivityIndicator,
	AnimatedFAB,
	Avatar,
	Button,
	Card,
	Chip,
	Icon,
	Text,
	useTheme,
} from "react-native-paper";
import Carousel from "../components/Carousel";
import Apis, { authApis, endpoints } from "../config/Apis";

import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentsList from "../components/CommentList";
import useStyle from "../styles/useStyle";
import { toVietNamDong } from "../utils/currency";
import { formatDate, getRelativeTime } from "../utils/datetime";
import PropertyCard from "../components/PropertyCard";

const RentalDetail = ({ navigation, route }) => {
	const theme = useTheme();
	const style = useStyle();

	const [isPhoneButtonExtended, setIsPhoneButtonExtended] = useState(true);
	const [loading, setLoading] = useState(false);

	const [rentalPost, setRentalPost] = useState();
	const [commentData, setCommentData] = useState({
		results: null,
		next: null,
	});

	const { id } = route.params;

	const loadComment = async () => {
		try {
			const res = await Apis.get(endpoints["rental-comments"](id));
			console.log(res.data);
			setCommentData(res.data);
		} catch (ex) {
			console.log(ex);
		}
	};

	const loadRepliesComment = async (commentId) => {
		try {
			const res = await Apis.get(
				endpoints["rental-comments-replies"](id, commentId)
			);
			return res.data;
		} catch (ex) {
			console.log(ex);
			return null;
		}
	};

	const loadRentalPost = async () => {
		setLoading(true);

		await Apis.get(endpoints.rentalDetails(id))
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
	};

	useEffect(() => {
		loadRentalPost();
	}, []);

	useEffect(() => {
		loadComment();
	}, [rentalPost]);

	// Khi trượt nút liên hệ sẽ thu nhỏ lại
	const handleOnScroll = ({ nativeEvent }) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

		setIsPhoneButtonExtended(currentScrollPosition <= 0);
	};

	const handleCommentPost = async (content) => {
		const token = await AsyncStorage.getItem("token");
		try {
			await authApis(token).post(endpoints["rental-comments"](id), {
				content,
			});
			loadComment(); // Refresh comments list
		} catch (ex) {
			console.log("Lỗi gửi bình luận:", ex);
		}
	};

	const handleCommentReply = async (commentId, content) => {
		const token = await AsyncStorage.getItem("token");

		console.log("ID: ", commentId, " - NỘI DUNG:", content);

		try {
			const res = await authApis(token).post(endpoints["rental-comments"](id), {
				content,
				reply_to: commentId,
			});
			console.log(res.data);
		} catch (ex) {
			console.log(ex);
			return false;
		}
	};

	return (
		<>
			<KeyboardAvoidingView
				behavior="padding"
				keyboardVerticalOffset={0}
				style={{ flex: 1, position: "relative" }}
			>
				{rentalPost ? (
					<View style={{ flex: 1 }}>
						<ScrollView style={[style.container]} onScroll={handleOnScroll}>
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

									<Text
										style={[
											style.title_small,
											{ color: theme.colors.primary, marginBottom: 16 },
										]}
									>
										Tiện ích
									</Text>

									<View
										style={{
											flexDirection: "row",
											flexWrap: "wrap",
											gap: 8,
											// marginHorizontal: -4, // Để đảm bảo các chip được căn đều
										}}
									>
										{rentalPost.utilities.map((utility) => (
											<Chip
												key={utility.id}
												icon={utility.icon}
												// mode="outlined"
												compact
												style={{
													backgroundColor: theme.colors.surfaceVariant,
													marginBottom: 4,
												}}
												textStyle={{
													fontSize: 10,
													color: theme.colors.onSurfaceVariant,
												}}
											>
												{utility.name}
											</Chip>
										))}
									</View>
								</Card.Content>
							</Card>

							{/* THÔNG TIN DÃY TRỌ VÀ VỊ TRÍ DÃY TRỌ */}
							<Card style={[style.card, { height: 512 }]}>
								<Card.Content>
									<View style={{ height: 478 }}>
										<Text
											style={[
												style.title_small,
												{ color: theme.colors.primary, marginBottom: 5 },
											]}
										>
											Thông tin dãy trọ
										</Text>

										<PropertyCard
											mode="small"
											name={rentalPost.property.name}
											images={rentalPost.property.images}
											address={`${rentalPost.property.address}, ${rentalPost.property.ward}, ${rentalPost.property.district}, ${rentalPost.property.province}`}
											onPress={() =>
												navigation.navigate("PropertyDetail", {
													id: rentalPost.property.id,
												})
											}
										/>

										<GoogleMaps.View
											style={{
												flex: 1,
												borderRadius: 6,
												flexShrink: 1,
												marginTop: 12,
											}}
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
									<View style={{ flexDirection: "row", gap: 4 }}>
										<Button style={{ flex: 1 }} mode="contained-tonal">
											Theo dõi
										</Button>
										<Button
											style={{ flex: 1 }}
											mode="contained"
											onPress={() =>
												navigation.navigate("ProfileDetail", {
													userData: { id: rentalPost.owner.id },
												})
											}
										>
											Trang cá nhân
										</Button>
									</View>
								</Card.Content>
							</Card>

							{/* KHUNG BÌNH LUẬN */}
							<Card style={[style.card, { flex: 1 }]}>
								<CommentsList
									commentData={commentData}
									setCommentData={setCommentData}
									onCommentPost={handleCommentPost}
									onCommentReply={handleCommentReply}
									loadRepliesComment={loadRepliesComment}
									loadComments={loadComment}
								/>
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
					</View>
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
