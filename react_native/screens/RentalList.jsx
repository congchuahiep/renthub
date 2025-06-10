import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import {
	ActivityIndicator,
	AnimatedFAB,
	Text,
	useTheme,
} from "react-native-paper";
import RentalAppbar from "../components/RentalAppbar";
import RentalPostCard from "../components/RentalPostCard";
import Apis, { endpoints } from "../config/Apis";
import { useAuth } from "../config/auth";
import useStyle from "../styles/useStyle";
import RentalFilterModal from "../components/RentalFilterModal";

const RentalList = () => {
	const navigation = useNavigation();

	const { user } = useAuth();

	// Style
	const theme = useTheme();
	const style = useStyle();
	const headerHeight = useHeaderHeight();

	// Các state hiệu ứng
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [isCreateButtonExtended, setIsCreateButtonExtended] = useState(true);

	const [showFilterModal, setShowFilterModal] = useState(false);
	const [isFiltered, setIsFiltered] = useState(false);

	const [nextPage, setNextPage] = useState(null);

	// State lưu dữ liệu
	const [rentalPosts, setRentalPosts] = useState([]);

	const loadRentalPosts = async (limitPerson, priceRange) => {
		setLoading(true);

		const params = {};

		if (limitPerson && limitPerson != 0) params.min_limit_person = limitPerson;
		else params.min_limit_person = null;

		if (priceRange && priceRange[0] != 0)
			params.min_price = priceRange[0] * 1000000;
		else params.min_price = null;

		if (priceRange && priceRange[1] != 31)
			params.max_price = priceRange[1] * 1000000;
		else params.max_price = null;

		await Apis.get(endpoints.rentals, { params })
			.then((res) => {
				setRentalPosts(res.data.results);
				setNextPage(res.data.next);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
				setRefreshing(false);
			});
	};

	const loadNextPage = async () => {
		setLoading(true);
		await Apis.get(nextPage)
			.then((res) => {
				setRentalPosts((prev) => [...prev, ...res.data.results]);
				setNextPage(res.data.next);
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

	useEffect(() => {
		navigation.setOptions({
			header: (props) => (
				<RentalAppbar
					isFiltered={isFiltered}
					setShowFilterModal={() => setShowFilterModal(true)}
					{...props}
				/>
			),
		});
	}, [navigation, isFiltered]);

	const handleOnRefresh = () => {
		setRefreshing(true);
		loadRentalPosts();
	};

	// Khi trượt nút thêm bài đăng sẽ thu nhỏ lại
	const handleOnScroll = ({ nativeEvent }) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

		setIsCreateButtonExtended(currentScrollPosition <= 0);
	};

	const handleEndReached = () => {
		if (!loading && nextPage) {
			loadNextPage();
		}
	};

	return (
		<View style={{ position: "relative", flex: 1 }}>
			<FlatList
				style={[style.container, { paddingBottom: 12 }]}
				data={rentalPosts}
				refreshControl={
					<RefreshControl
						progressViewOffset={headerHeight}
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
				ListHeaderComponent={<View style={{ height: headerHeight }} />}
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
					loading ? (
						<ActivityIndicator size={24} style={{ padding: 12 }} />
					) : (
						<View style={{ height: 24 }} />
					)
				}
				onScroll={handleOnScroll}
				onEndReached={handleEndReached}
				onEndReachedThreshold={0.7}
			/>
			{user?.user_type === "landlord" && (
				<AnimatedFAB
					label={"Thêm bài đăng"}
					animateFrom={"right"}
					extended={isCreateButtonExtended}
					style={{ position: "absolute", right: 24, bottom: 24 }}
					icon="plus"
					onPress={() => navigation.navigate("RentalCreate")}
				/>
			)}

			<RentalFilterModal
				isFiltered={isFiltered}
				setIsFiltered={setIsFiltered}
				showFilterModal={showFilterModal}
				setShowFilterModal={setShowFilterModal}
				loadRentalPosts={loadRentalPosts}
			/>
		</View>
	);
};

export default RentalList;
