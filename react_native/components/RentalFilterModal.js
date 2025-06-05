import { View } from "react-native";
import {
	Button,
	Divider,
	IconButton,
	Modal,
	Portal,
	Text,
	useTheme,
} from "react-native-paper";
import useStyle from "../styles/useStyle";
import Counter from "./form/Counter";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useState } from "react";

export default function RentalFilterModal({
	isFiltered,
	setIsFiltered,
	showFilterModal,
	setShowFilterModal,
	loadRentalPosts,
}) {
	const style = useStyle();
	const theme = useTheme();

	const [initialFilters] = useState({
		limitPerson: 0,
		priceRange: [0, 31],
	});

	const [limitPerson, setLimitPerson] = useState(initialFilters.limitPerson);
	const [priceRange, setPriceRange] = useState(initialFilters.priceRange); // Mặc định là max
	const [selectedLocation, setSelectedLocation] = useState(null); // TODO TRIỂN KHAI KHẢ NĂNG LỌC THEO TỈNH/HUYỆN/XÃ

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
						<Text style={[style.title_small, style.text_primary]}>Bộ lọc</Text>

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
						<View
							style={{
								gap: 0,
							}}
						>
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
							<View
								style={{
									alignItems: "center",
								}}
							>
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
							disabled={!hasFilterChanges() && !isFiltered} // Disable nếu không có thay đổi
							onPress={() => {
								setIsFiltered(true);
								setShowFilterModal(false);
								loadRentalPosts(limitPerson, priceRange);
							}}
						>
							Lọc
						</Button>
					</View>
				</View>
			</Modal>
		</Portal>
	);
}
