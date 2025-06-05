import { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import {
	ActivityIndicator,
	AnimatedFAB,
	Button,
	Divider,
	FAB,
	IconButton,
	Modal,
	Portal,
	Text,
	useTheme,
} from "react-native-paper";
import RentalPostCard from "../components/RentalPostCard";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../config/auth";
import { useHeaderHeight } from "@react-navigation/elements";
import Counter from "../components/form/Counter";
import RentalAppbar from "../components/RentalAppbar";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

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
	const [isPhoneButtonExtended, setIsPhoneButtonExtended] = useState(true);

	const [showFilterModal, setShowFilterModal] = useState(false);

	const [isFiltered, setIsFiltered] = useState(false);
	const [limitPerson, setLimitPerson] = useState(0);
	const [priceRange, setPriceRange] = useState([0, 31]); // Mặc định là max
	const [selectedLocation, setSelectedLocation] = useState(null);

	const [initialFilters] = useState({
		limitPerson: 0,
		priceRange: [0, 31],
	});

	// State lưu dữ liệu
	const [rentalPosts, setRentalPosts] = useState([]);

	const loadRentalPosts = async () => {
		setLoading(true);

		const params = {};

		if (limitPerson != 0) params.min_limit_person = limitPerson;
		else params.min_limit_person = null;

		if (priceRange[0] != 0) params.min_price = priceRange[0] * 1000000;
		else params.min_price = null;

		if (priceRange[1] != 31) params.max_price = priceRange[1] * 1000000;
		else params.max_price = null;

		await Apis.get(endpoints.rentals, { params })
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

	useEffect(() => {
		if (!isFiltered) {
			loadRentalPosts();
		}
	}, [isFiltered, limitPerson, priceRange]);

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

		setIsPhoneButtonExtended(currentScrollPosition <= 0);
	};

	// Hàm kiểm tra xem người dùng đã thay đổi giá trị filter chưa
	const hasFilterChanges = () => {
		return (
			limitPerson !== initialFilters.limitPerson ||
			priceRange[0] !== initialFilters.priceRange[0] ||
			priceRange[1] !== initialFilters.priceRange[1]
		);
	};

	// Hàm reset filter về giá trị ban đầu
	const resetFilters = () => {
		setLimitPerson(initialFilters.limitPerson);
		setPriceRange(initialFilters.priceRange);
		setIsFiltered(false);
		loadRentalPosts();
	};

	return (
		<View style={{ position: "relative", flex: 1 }}>
			<FlatList
				style={[style.container]}
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
					onPress={() => navigation.navigate("RentalCreate")}
				/>
			)}

			<Portal>
				<Modal
					visible={showFilterModal}
					onDismiss={() => setShowFilterModal(false)}
				>
					<View
						style={[
							style.card,
							{
								justifyContent: "space-between",
								height: 360,
								marginHorizontal: 32,
								padding: 16,
								backgroundColor: theme.colors.background,
								borderRadius: 16,
							},
						]}
					>
						<View>
							<Text style={[style.title_small, style.text_primary]}>
								Bộ lọc
							</Text>

							<Counter
								label="Số lượng người ở"
								icon="account-group-outline"
								value={limitPerson}
								onChange={(value) => {
									setLimitPerson(value);
								}}
								min={0}
								max={10}
							/>

							<Divider />

							{/* Khoảng giá */}
							<View style={{ gap: 0 }}>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<IconButton icon="cash" size={20} />
										<Text>Khoảng giá</Text>
									</View>

									<Text
										style={{
											backgroundColor: theme.colors.secondaryContainer,
											paddingVertical: 2,
											paddingHorizontal: 6,
										}}
									>
										{priceRange[0]} triệu -{" "}
										{priceRange[1] === 31 ? "max" : priceRange[1] + " triệu"}
									</Text>
								</View>
								<View style={{ alignItems: "center" }}>
									<MultiSlider
										values={priceRange}
										onValuesChange={setPriceRange}
										min={0}
										max={31}
										step={1}
										selectedStyle={{
											backgroundColor: theme.colors.primary,
										}}
										sliderLength={240}
										markerStyle={{
											backgroundColor: "white",
											borderColor: theme.colors.primary,
											borderWidth: 1,
										}}
									/>
								</View>
							</View>
						</View>

						<View
							style={{
								justifyContent: "flex-end",
								gap: 8,
								flexDirection: "row",
							}}
						>
							<Button
								textColor={theme.colors.error}
								onPress={resetFilters}
								disabled={!isFiltered} // Chỉ enable khi đang có bộ lọc được áp dụng
							>
								Xoá bộ lọc
							</Button>
							<Button
								mode="contained-tonal"
								onPress={() => {
									if (isFiltered) {
										// Nếu đang lọc, khôi phục giá trị đang được áp dụng
										setLimitPerson(initialFilters.limitPerson);
										setPriceRange(initialFilters.priceRange);
									} else {
										// Nếu chưa lọc, reset về giá trị ban đầu
										resetFilters();
									}
									setShowFilterModal(false);
								}}
							>
								Huỷ
							</Button>
							<Button
								mode="contained"
								disabled={!hasFilterChanges()} // Disable nếu không có thay đổi
								onPress={() => {
									setIsFiltered(true);
									loadRentalPosts();
									setShowFilterModal(false);
								}}
							>
								Lọc
							</Button>
						</View>
					</View>
				</Modal>
			</Portal>
		</View>
	);
};

export default RentalList;
