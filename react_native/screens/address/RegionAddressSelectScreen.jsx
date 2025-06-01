import { useEffect, useState } from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Apis, { endpoints } from "../../config/Apis";
import BottomSafeAreaView from "../../components/BottomSafeAreaView";

const RegionAddressSelectScreen = ({ navigation, route }) => {
	const theme = useTheme();

	const [provinces, setProvinces] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);

	const [province, setProvince] = useState(null);
	const [district, setDistrict] = useState(null);
	const [ward, setWard] = useState(null);

	const [step, setStep] = useState("province"); // "province" | "district" | "ward"

	useEffect(() => {
		Apis.get(endpoints.provinces).then((res) => setProvinces(res.data));
	}, []);

	useEffect(() => {
		if (province) {
			setDistrict(null);
			setWard(null);
			setWards([]);
			Apis.get(endpoints.districts, { params: { province_id: province } }).then(
				(res) => setDistricts(res.data)
			);
		} else {
			setDistricts([]);
			setWards([]);
		}
	}, [province]);

	useEffect(() => {
		if (district) {
			setWard(null);
			Apis.get(endpoints.wards, { params: { district_id: district } }).then(
				(res) => setWards(res.data)
			);
		} else {
			setWards([]);
		}
	}, [district]);

	const getList = () => {
		if (step === "province") return provinces;
		if (step === "district") return districts;
		if (step === "ward") return wards;
		return [];
	};

	const getName = (list, code) =>
		list.find((i) => i.code === code)?.full_name || "";

	// Xử lý trả về dữ liệu
	const handleSubmit = () => {
		const region_address =
			getName(wards, ward) +
			", " +
			getName(districts, district) +
			", " +
			getName(provinces, province);
		navigation.popTo(route.params.returnScreen, {
			ward: ward,
			district: district,
			province: province,
			region_address: region_address,
		});
	};

	return (
		<BottomSafeAreaView>
			<View style={{ flex: 1, padding: 16 }}>
				{/* 3 ô chọn */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginBottom: 16,
					}}
				>
					{["province", "district", "ward"].map((type, idx) => (
						<TouchableOpacity
							key={type}
							style={{
								flex: 1,
								marginHorizontal: 4,
								padding: 12,
								borderWidth: 2,
								borderColor:
									step === type ? theme.colors.primary : theme.colors.surface,
								borderRadius: 8,
								backgroundColor: theme.colors.surface,
								alignItems: "center",
							}}
							onPress={() => {
								if (type === "province") setStep("province");
								else if (type === "district" && province) setStep("district");
								else if (type === "ward" && district) setStep("ward");
							}}
							activeOpacity={0.7}
						>
							<Text
								style={{
									fontWeight: "bold",
									color:
										step === type
											? theme.colors.primary
											: theme.colors.secondary,
								}}
							>
								{type === "province"
									? "Tỉnh/TP"
									: type === "district"
									? "Quận/Huyện"
									: "Phường/Xã"}
							</Text>
							<Text
								style={{
									marginTop: 4,
									color:
										step === type
											? theme.colors.primary
											: theme.colors.secondary,
									fontSize: 12,
								}}
							>
								{type === "province"
									? getName(provinces, province)
									: type === "district"
									? getName(districts, district)
									: getName(wards, ward)}
							</Text>
						</TouchableOpacity>
					))}
				</View>
				{/* Danh sách lựa chọn */}
				<FlatList
					data={getList()}
					keyExtractor={(item) => item.code.toString()}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={{
								padding: 14,
								borderBottomWidth: 1,
								borderColor: "#eee",
								backgroundColor:
									(step === "province" && province === item.code) ||
									(step === "district" && district === item.code) ||
									(step === "ward" && ward === item.code)
										? "#e3f2fd"
										: "#fff",
							}}
							onPress={() => {
								if (step === "province") {
									setProvince(item.code);
									setStep("district");
								} else if (step === "district") {
									setDistrict(item.code);
									setStep("ward");
								} else if (step === "ward") {
									setWard(item.code);
								}
							}}
						>
							<Text>{item.full_name}</Text>
						</TouchableOpacity>
					)}
					ListEmptyComponent={
						<Text style={{ textAlign: "center", marginTop: 24, color: "#888" }}>
							Không có dữ liệu
						</Text>
					}
					style={{ flex: 1, marginBottom: 16 }}
				/>
				<Button
					mode="contained"
					disabled={!province || !district || !ward}
					onPress={handleSubmit}
				>
					Xác nhận
				</Button>
			</View>
		</BottomSafeAreaView>
	);
};

export default RegionAddressSelectScreen;
