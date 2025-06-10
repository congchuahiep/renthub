import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { AnimatedFAB, Avatar, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";
import { getRelativeTime } from "../utils/datetime";
import { useAuth } from "../config/auth";

const RoomSeekingList = () => {
	const { user } = useAuth();

	const theme = useTheme();
	const style = useStyle();
	const navigation = useNavigation();

	const [roomSeekings, setRoomSeekings] = useState([]);

	const [refreshing, setRefreshing] = useState(false);
	const [isCreateButtonExtended, setIsCreateButtonExtended] = useState(true);

	const [loading, setLoading] = useState(false);
	const [nextPage, setNextPage] = useState(null);

	const statusTypeMapping = {
		approved: "Đã kiểm duyệt",
		pending: "Đang kiểm duyệt",
		rejected: "Từ chối kiểm duyệt",
		expired: "Hết hạn",
		rented: "Đã thuê",
	};

	const loadRoomSeekingPosts = async () => {
		try {
			setLoading(true);
			const res = await Apis.get(endpoints.roomseekings);

			setRoomSeekings(res.data.results);
			setNextPage(res.data.next);
		} catch (ex) {
			console.error("Error loading posts:", ex);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	const loadNextPage = async () => {
		try {
			setLoading(true);
			const res = await Apis.get(nextPage);

			setRoomSeekings((prev) => [...prev, ...res.data.results]);
			setNextPage(res.data.next);
		} catch (ex) {
			console.error("Error loading posts:", ex);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadRoomSeekingPosts();
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		loadRoomSeekingPosts();
	};

	const onEndReached = () => {
		if (!loading && nextPage) {
			loadNextPage();
		}
	};

	const renderFooter = () => {
		if (!loading) return null;
		return (
			<View style={{ paddingVertical: 20 }}>
				<ActivityIndicator size="small" color={theme.colors.primary} />
			</View>
		);
	};

	// Khi trượt nút thêm bài đăng sẽ thu nhỏ lại
	const handleOnScroll = ({ nativeEvent }) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

		setIsCreateButtonExtended(currentScrollPosition <= 0);
	};

	return (
		<View style={{ position: "relative", flex: 1 }}>
			<FlatList
				style={style.container}
				data={roomSeekings}
				keyExtractor={(item, index) => item.id + "_" + index}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("RoomSeekingDetail", {
								postIntanceId: item.post.id,
							})
						}
					>
						<View style={[style.card, { padding: 15 }]}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginBottom: 8,
								}}
							>
								<Avatar.Image
									source={item.owner.avatar ? { uri: item.owner.avatar } : null}
									style={{ borderRadius: 18, marginRight: 8 }}
									size={32}
								/>
								<View>
									<Text
										style={{
											color: theme.colors.onSurface,
											fontWeight: "bold",
										}}
									>
										{item.owner.name}
									</Text>
									<Text style={{ color: theme.colors.onSurface, fontSize: 12 }}>
										{getRelativeTime(item.created_date)}
									</Text>
								</View>
							</View>

							<Text
								style={{
									fontWeight: "bold",
									fontSize: 18,
									marginBottom: 8,
									color: theme.colors.onSurface,
								}}
							>
								{item.title}
							</Text>
							<Text style={{ color: theme.colors.onSurface }}>
								Khu vực: {item.position || "Chưa cập nhật"}
							</Text>
							<Text style={{ color: theme.colors.onSurface }}>
								Diện tích: {item.area} m²
							</Text>
							<Text style={{ color: theme.colors.onSurface }}>
								Giới hạn: {item.limit_person} người
							</Text>
							<Text style={{ color: theme.colors.onSurface }}>
								Trạng thái: {statusTypeMapping[item.status] || "Không xác định"}
							</Text>
							<Text style={{ color: theme.colors.onSurface }}>
								Hết hạn: {moment(item.expired_date).format("DD/MM/YYYY")}
							</Text>
						</View>
					</TouchableOpacity>
				)}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={[theme.colors.primary]}
					/>
				}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.3}
				onScroll={handleOnScroll}
				ListFooterComponent={renderFooter}
			/>

			{user?.user_type === "tenant" && (
				<AnimatedFAB
					label={"Thêm bài đăng"}
					animateFrom={"right"}
					extended={isCreateButtonExtended}
					style={{ position: "absolute", right: 24, bottom: 24 }}
					icon="plus"
					onPress={() => navigation.navigate("RoomSeekingCreate")}
				/>
			)}
		</View>
	);
};

export default RoomSeekingList;
