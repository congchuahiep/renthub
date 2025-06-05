import { GoogleMaps } from "expo-maps";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import {
	Dimensions,
	Modal,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import {
	ActivityIndicator,
	Button,
	Chip,
	Icon,
	Text,
	useTheme,
} from "react-native-paper";
import BottomSafeAreaView from "../components/BottomSafeAreaView";
import Carousel from "../components/Carousel";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";
import { toVietNamDong } from "../utils/currency";
import { getRadiusInMeters } from "../utils/geography";
import { useNavigation } from "@react-navigation/native";

const RentalMapping = () => {
	const windowHeight = Dimensions.get("window").height;
	const theme = useTheme();
	const style = useStyle();

	const navigation = useNavigation();

	const [rentalPostMarkers, setRentalPostMarkers] = useState([]);
	const [markerLoading, setMarkerLoading] = useState(false);

	const [selectedRentalPost, setSelectedRentalPost] = useState(null);
	const [selectedRentalPostId, setSelectedRentalPostId] = useState(null);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	const [bottomSheetLoading, setBottomSheetLoading] = useState(false);

	const loadRentalPostMarker = useCallback(
		debounce(async (latitude, longitude, radius) => {
			try {
				console.log("⏳ Tìm kiếm nhà trọ quanh bán kính: ", radius);
				setMarkerLoading(true);
				const res = await Apis.get(endpoints.rentals, {
					params: { latitude, longitude, radius },
				});

				setRentalPostMarkers(
					res.data.results.map((post) => {
						const latitude = post?.property?.latitude;
						const longitude = post?.property?.longitude;

						console.log(post.post.id);

						if (typeof latitude === "number" && typeof longitude === "number") {
							return {
								id: post.post.id.toString(), // ??? VÌ MỘT LÝ DO GÌ ĐÓ NÓ PHẢI ĐỔI SANG CHUỖI
								title: post.title,
								coordinates: {
									latitude,
									longitude,
								},
							};
						}

						return null;
					})
				);
			} catch (ex) {
				console.log(ex);
			} finally {
				setMarkerLoading(false);
			}
		}, 1000),
		[]
	);

	const loadRentalPost = async (id) => {
		setBottomSheetLoading(true);

		if (!id) return;

		await Apis.get(endpoints.rentalDetails(id))
			.then((res) => {
				console.log(res.data);
				setSelectedRentalPost(res.data);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setBottomSheetLoading(false);
			});
	};

	useEffect(() => {
		loadRentalPostMarker();
	}, []);

	useEffect(() => {
		loadRentalPost(selectedRentalPostId);
	}, [selectedRentalPostId]);

	// Function to open the bottom sheet
	const handleOpenBottomSheet = () => {
		setIsBottomSheetOpen(true);
	};

	// Function to close the bottom sheet
	const handleCloseBottomSheet = () => {
		setIsBottomSheetOpen(false);
	};

	return (
		<BottomSafeAreaView style={{ flex: 1 }}>
			<View style={{ flex: 1, position: "relative" }}>
				<GoogleMaps.View
					style={{ flex: 1 }}
					cameraPosition={{
						coordinates: { latitude: 16.15, longitude: 106 },
						zoom: 6,
					}}
					markers={rentalPostMarkers}
					onMarkerClick={(marker) => {
						handleOpenBottomSheet();
						setSelectedRentalPostId(marker.id);
					}}
					onCameraMove={({ coordinates, zoom }) => {
						const { latitude, longitude } = coordinates;
						// Tính toán bán kính của vùng cần fetch các bài đăng dựa trên
						// có bán kính bằng nửa chiều dài của màn hình
						const radius =
							getRadiusInMeters(latitude, zoom, windowHeight) / 1000; // Đổi mét sang km
						// Gọi debounce hàm fetch
						loadRentalPostMarker(latitude, longitude, radius);
					}}
				/>
				{markerLoading && (
					<Chip
						style={{
							position: "absolute",
							top: 110,
							width: 128,
							alignSelf: "center",
						}}
					>
						<ActivityIndicator style={{ height: 11, paddingRight: 8 }} />
						Đang tải
					</Chip>
				)}
			</View>

			{/* Drawer */}

			<Modal
				visible={isBottomSheetOpen}
				onDismiss={handleCloseBottomSheet}
				onRequestClose={handleCloseBottomSheet}
				animationType="slide"
				transparent={true}
			>
				<TouchableOpacity
					style={{ flex: 1 }}
					onPressOut={handleCloseBottomSheet}
				/>
				<View
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						justifyContent: "flex-start",
						backgroundColor: theme.colors.background,
						borderTopLeftRadius: 12,
						borderTopRightRadius: 12,
						padding: 16,
						bottom: 0,
						height: windowHeight * 0.36,
					}}
				>
					{bottomSheetLoading ? (
						<ActivityIndicator />
					) : (
						selectedRentalPost && (
							<>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										alignContent: "center",
										gap: 12,
										marginBottom: 12,
									}}
								>
									<View style={{ width: 200, height: 200 }}>
										{selectedRentalPost.post.images && (
											<Carousel images={selectedRentalPost.post.images} />
										)}
									</View>

									<View style={{ flex: 1 }}>
										<Text
											style={[
												style.text_primary,
												{ paddingVertical: 6, fontWeight: "bold" },
											]}
										>
											{selectedRentalPost.title}
										</Text>

										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												marginBottom: 16,
											}}
										>
											<Icon
												source={"bed-outline"}
												size={16}
												color={theme.colors.primary}
											/>
											<Text style={{ marginLeft: 3, marginRight: 12 }}>
												{selectedRentalPost.number_of_bedrooms}
											</Text>

											<Icon
												source={"shower"}
												size={16}
												color={theme.colors.primary}
											/>
											<Text style={{ marginLeft: 3, marginRight: 12 }}>
												{selectedRentalPost.number_of_bathrooms}
											</Text>

											<Icon
												source={"square-rounded-outline"}
												size={16}
												color={theme.colors.primary}
											/>
											<Text style={{ marginLeft: 3 }}>
												{selectedRentalPost.area}m²
											</Text>
										</View>

										<View style={{ flexDirection: "row" }}>
											{/* <Icon
												source={"map-marker-outline"}
												size={14}
												color={theme.colors.secondary}
											/> */}
											<Text
												style={{
													color: theme.colors.secondary,
													marginBottom: 5,
													fontSize: 13,
												}}
											>
												{selectedRentalPost.property.address},{"\n"}
												{selectedRentalPost.property.ward},{"\n"}
												{selectedRentalPost.property.district},{"\n"}
												{selectedRentalPost.property.province}
											</Text>
										</View>
										<Text
											style={{
												color: theme.colors.primary,
												fontWeight: 900,
												fontSize: 16,
												flexGrow: 1,
												alignSelf: "flex-end",
											}}
										>
											{toVietNamDong(selectedRentalPost.price)}
										</Text>
									</View>
								</View>
								<Button
									mode="contained"
									onPress={() => {
										handleCloseBottomSheet();
										navigation.navigate("RentalDetail", {
											id: selectedRentalPost.post.id,
											title: selectedRentalPost.title,
										});
									}}
								>
									Xem chi tiết
								</Button>
							</>
						)
					)}
				</View>
			</Modal>
		</BottomSafeAreaView>
	);
};

export default RentalMapping;
