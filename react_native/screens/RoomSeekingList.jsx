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
import { Avatar, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";
import { getRelativeTime } from "../utils/datetime";

const RoomSeekingList = () => {
	const theme = useTheme();
	const style = useStyle();
	const navigation = useNavigation();
	const [roomSeekings, setRoomSeekings] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [page, setPage] = useState(1);
	const [hasNextPage, setHasNextPage] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const pageSize = 10;

	const statusTypeMapping = {
		approved: "Đã kiểm duyệt",
		pending: "Đang kiểm duyệt",
		rejected: "Từ chối kiểm duyệt",
		expired: "Hết hạn",
		rented: "Đã thuê",
	};

	const loadRoomSeekingPosts = async (pageToLoad = 1, refreshing = false) => {
		try {
			// const res = await Apis.get(`${endpoints.roomseekings}?page=${pageToLoad}&page_size=${pageSize}`);
			const res = await Apis.get(endpoints.roomseekings);
			if (refreshing) {
				setRoomSeekings(res.data.results);
			} else {
				setRoomSeekings((prev) => [...prev, ...res.data.results]);
			}
			setHasNextPage(res.data.next !== null);
		} catch (ex) {
			console.error("Error loading posts:", ex);
		}
	};

	useEffect(() => {
		loadRoomSeekingPosts();
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		setPage(1);
		loadRoomSeekingPosts(1, true).finally(() => setRefreshing(false));
	};

	const onEndReached = () => {
		if (hasNextPage && !isLoadingMore) {
			const nextPage = page + 1;
			setIsLoadingMore(true);
			loadRoomSeekingPosts(nextPage).finally(() => {
				setPage(nextPage);
				setIsLoadingMore(false);
			});
		}
	};
  
	const renderFooter = () => {
		if (!isLoadingMore) return null;
		return (
			<View style={{ paddingVertical: 20 }}>
				<ActivityIndicator size="small" color={theme.colors.primary} />
			</View>
		);
	};

	return (
		<SafeAreaView style={style.container}>
			<FlatList
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
				ListFooterComponent={renderFooter}
			/>
		</SafeAreaView>
	);
};

export default RoomSeekingList;
