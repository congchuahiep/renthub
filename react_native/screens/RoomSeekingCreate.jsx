import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import {
	Button,
	Card,
	HelperText,
	Menu,
	TextInput,
	Title,
	useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Apis, { authApis, endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";
import { useNavigation } from "@react-navigation/native";
import { useSnackbar } from "../config/snackbar";

const RoomSeekingCreate = () => {
  const navigation = useNavigation();
  const snackbar = useSnackbar();

	const theme = useTheme();
	const style = useStyle();

	const [post, setPost] = useState({
		title: "",
		content: "",
		area: "",
		limit_person: "1",
		district: "",
		province: "",
		position: "",
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [loadingDistricts, setLoadingDistrict] = useState(false);
	const [loadingProvince, setLoadingProvince] = useState(false);
	const [provinces, setProvinces] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [visible, setVisible] = useState(false);
	const [visibleDistrict, setVisibleDistrict] = useState(false);
	const [selectedProvinceLabel, setSelectedProvinceLabel] = useState("");
	const [selectedDistrictLabel, setSelectedDistrictLabel] = useState("");

	const loadDistricts = async (provinceId) => {
		try {
			setLoadingDistrict(true);
			const res = await Apis.get(
				`${endpoints.districts}?province_id=${provinceId}`
			);
			const formatter = res.data.map((item) => ({
				label: item.full_name || "Không có tên", // Sử dụng `full_name` như trong ảnh Postman
				value: item.code || "undefined",
			}));
			setDistricts(formatter.filter((item) => item.value !== "undefined"));
		} catch (ex) {
			console.log("❌ Lỗi load districts:", ex);
			setDistricts([]);
		} finally {
			setLoadingDistrict(false);
		}
	};

	const loadProvince = async () => {
		try {
			setLoadingProvince(true);
			const res = await Apis.get(endpoints.provinces);

			// Đảm bảo res.data là mảng và có dữ liệu
			const provincesData = Array.isArray(res?.data) ? res.data : [];
			const formatted = provincesData
				.map((item) => ({
					label: item.name || "Không có tên",
					value: item.code || "",
				}))
				.filter((item) => item.value !== "undefined"); // Lọc bỏ item không hợp lệ

			setProvinces(formatted || []);
			// Luôn set là mảng (kể cả formatted undefined)
			// console.log(provinces);
		} catch (error) {
			console.error("Lỗi khi tải tỉnh/thành:", error);
			setProvinces([]); // Luôn set là mảng rỗng nếu có lỗi
		} finally {
			setLoadingProvince(false);
		}
	};

	useEffect(() => {
		loadProvince();
		console.log("✅ Cập nhật provinces:", provinces);
	}, []);

	const updateField = (value, field) => {
		// Giới hạn số người ở tối thiểu là 1
		if (field === "limit_person") {
			if (parseInt(value) < 1 || isNaN(value)) value = "1";
		}
		setPost({ ...post, [field]: value });
		setErrors({ ...errors, [field]: null });
	};

	const validate = () => {
		const newErrors = {};
		for (let field in post) {
			if (!post[field] || post[field].toString().trim() === "") {
				newErrors[field] = "Không được để trống";
			}
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const postCreate = async () => {
		if (!validate()) return;

		try {
			const token = await AsyncStorage.getItem("token");
			setLoading(true);

			const form = new FormData();
			console.log("Dữ liệu trước khi gửi:", post); // Debug data

			// Append từng field một cách rõ ràng
			form.append("title", post.title);
			form.append("content", post.content);
			form.append("area", post.area);
			form.append("limit_person", post.limit_person);
			form.append("position", post.position);
			form.append("province", post.province);
			form.append("district", post.district);

			for (const key in post) {
				form.append(key, post[key]);
			}

			console.log(form.data);

			await authApis(token).post(endpoints.roomseekings, form, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			snackbar("Tạo bài đăng thành công!");
			navigation.popToTop();
		} catch (ex) {
			// NOTE TẠm thời đóng
      console.log("❌ Error:", ex.response?.data || ex.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView contentContainerStyle={{ padding: 16 }}>
			<Card style={style.card}>
				<Card.Content>
					<TextInput
						label="Tiêu đề"
						value={post.title}
						onChangeText={(val) => updateField(val, "title")}
						mode="outlined"
						style={{ marginBottom: 16 }}
						error={!!errors.title}
					/>
					<TextInput
						label="Nội dung"
						value={post.content}
						onChangeText={(val) => updateField(val, "content")}
						mode="outlined"
						multiline
						numberOfLines={4}
						style={{ marginBottom: 16 }}
						error={!!errors.content}
					/>
					<TextInput
						label="Diện tích (m²)"
						value={post.area}
						onChangeText={(val) => updateField(val, "area")}
						keyboardType="numeric"
						mode="outlined"
						style={{ marginBottom: 16 }}
						error={!!errors.area}
					/>
					<TextInput
						label="Giới hạn người ở"
						value={post.limit_person}
						onChangeText={(val) =>
							updateField(val.replace(/[^0-9]/g, ""), "limit_person")
						}
						keyboardType="numeric"
						mode="outlined"
						style={{ marginBottom: 16 }}
						error={!!errors.limit_person}
					/>
					<TextInput
						label="giá tối thiểu(VNĐ)"
						value={post.price_min}
						onChangeText={(val) => updateField(val, "price_min")}
						keyboardType="numeric"
						mode="outlined"
						style={{ marginBottom: 16 }}
						error={!!errors.limit_person}
					/>
					<TextInput
						label="Giá tối đa(VNĐ)"
						value={post.price_max}
						onChangeText={(val) => updateField(val, "price_max")}
						keyboardType="numeric"
						mode="outlined"
						style={{ marginBottom: 16 }}
						error={!!errors.limit_person}
					/>
					<HelperText type="info" visible>
						* Tối thiểu là 1 người
					</HelperText>
					<TextInput
						label="Khu vực"
						value={post.position}
						onChangeText={(val) => updateField(val, "position")}
						mode="outlined"
						style={{ marginBottom: 16 }}
						error={!!errors.position}
					/>
					{Object.keys(errors).length > 0 && (
						<Text style={{ color: "red", marginBottom: 10 }}>
							Vui lòng điền đầy đủ thông tin hợp lệ.
						</Text>
					)}
					<Menu
						visible={visible}
						onDismiss={() => setVisible(false)}
						anchor={
							<Button
								onPress={() => setVisible(true)}
								mode="outlined"
								style={{ marginBottom: 16 }}
								contentStyle={{ flexDirection: "row-reverse" }}
							>
								{selectedProvinceLabel || "Chọn tỉnh/thành"}
							</Button>
						}
					>
						{provinces.map((province) => (
							<Menu.Item
								key={province.value}
								onPress={() => {
									updateField(province.value, "province"); // Lưu ID
									setSelectedProvinceLabel(province.label); // Hiển thị label
									loadDistricts(province.value); // Gọi huyện theo tỉnh
									setVisible(false);
								}}
								title={province.label}
							/>
						))}
					</Menu>
					<Menu
						visible={visibleDistrict}
						onDismiss={() => setVisibleDistrict(false)}
						anchor={
							<Button
								onPress={() => setVisibleDistrict(true)}
								mode="outlined"
								style={{ marginBottom: 16 }}
								contentStyle={{ flexDirection: "row-reverse" }}
							>
								{selectedDistrictLabel || "Chọn quận/huyện"}
							</Button>
						}
					>
						{districts.map((district) => (
							<Menu.Item
								key={district.value}
								onPress={() => {
									updateField(district.value, "district"); // Lưu ID
									setSelectedDistrictLabel(district.label); // Hiển thị label
									setVisibleDistrict(false);
								}}
								title={district.label}
							/>
						))}
					</Menu>
					<Button
						mode="contained"
						onPress={postCreate}
						loading={loading}
						disabled={loading}
						style={{ marginTop: 8, borderRadius: 8, paddingVertical: 6 }}
					>
						Đăng bài
					</Button>
				</Card.Content>
			</Card>
		</ScrollView>
	);
};

export default RoomSeekingCreate;
