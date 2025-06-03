import { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import {
	ActivityIndicator,
	AnimatedFAB,
	Button,
	FAB,
	Text,
	useTheme,
} from "react-native-paper";
import RentalPostCard from "../components/RentalPostCard";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../config/auth";

const RentalList = () => {
	const navigation = useNavigation();

	const { user } = useAuth();

	// Style
	const theme = useTheme();
	const style = useStyle();
	// Các state hiệu ứng
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [isPhoneButtonExtended, setIsPhoneButtonExtended] = useState(true);
	// State lưu dữ liệu
	const [rentalPosts, setRentalPosts] = useState([]);

	const loadRentalPosts = async () => {
		setLoading(true);

		await Apis.get(endpoints.rentals)
			.then((res) => {
				setRentalPosts(res.data.results);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
				setRefreshing(false);
			});
	};

	useEffect(() => {
		loadRentalPosts();
	}, []);

	const handleOnRefresh = () => {
		setRefreshing(true);
		loadRentalPosts();
	};

	// Khi trượt nút thêm bài đăng sẽ thu nhỏ lại
	const handleOnScroll = ({ nativeEvent }) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

		setIsPhoneButtonExtended(currentScrollPosition <= 0);
	};

	return (
		<View style={{ position: "relative", flex: 1 }}>
			<FlatList
				style={[style.container]}
				data={rentalPosts}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleOnRefresh}
						colors={[theme.colors.primary]}
						progressBackgroundColor={theme.colors.background}
					/>
				}
				renderItem={({ item }) => (
					<RentalPostCard
						id={item.post.id}
						title={item.title}
						area={item.area}
						images={item.post.images}
						price={item.price}
						address={item.property.district + ", " + item.property.province}
						numberOfBed={item.number_of_bedrooms}
						numberOfBathroom={item.number_of_bathrooms}
					/>
				)}
				ListEmptyComponent={
					!loading &&
					rentalPosts && (
						<View
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
								paddingVertical: 40,
							}}
						>
							<Text
								style={{
									fontSize: 16,
									textAlign: "center",
									color: theme.colors.outline,
								}}
							>
								Không có bài đăng nào cả 🥲
							</Text>
						</View>
					)
				}
				ListFooterComponent={
					loading ? <ActivityIndicator /> : <View style={{ height: 8 }} />
				}
				onScroll={handleOnScroll}
			/>
			{user?.user_type === "landlord" && (
				<AnimatedFAB
					label={"Thêm bài đăng"}
					animateFrom={"right"}
					extended={isPhoneButtonExtended}
					style={{ position: "absolute", right: 24, bottom: 24 }}
					icon="plus"
					onPress={() =>
						navigation.navigate("RentalCreate")
					}
				/>
			)}
		</View>
	);
};

export default RentalList;
