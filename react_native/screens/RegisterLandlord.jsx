import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, View, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
	Button,
	HelperText,
	Text,
	TextInput,
	useTheme,
} from "react-native-paper";
import BottomSafeAreaView from "../components/BottomSafeAreaView";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";
import { tenantInfo } from "./RegisterTenant";
import AvatarPicker from "../components/form/AvatarPicker";
import InputField from "../components/form/InputField";
import ImagesPicker from "../components/form/ImagesPicker";
import DatePicker from "../components/form/DatePicker";

// CÁC TRƯỜNG ĐĂNG KÝ TÀI KHOẢN CHỦ TRỌ ĐƯỢC CHIA LÀM 3 BƯỚC

// STEP 1: Thông tin căn bản (giống thông tin đăng ký người dùng tìm trọ)
const step1 = tenantInfo;
// STEP 2: Thông tin cá nhân
const step2 = [
	{
		label: "Số điện thoại",
		field: "phone_number",
		secureTextEntry: false,
		icon: "phone",
	},
	{
		label: "Ngày sinh",
		field: "dob",
		type: "date",
		icon: "cake-variant",
	},
	{
		label: "Số căn cước công dân",
		field: "cccd",
		secureTextEntry: false,
		icon: "card-account-details",
	},
	{
		label: "Đường",
		field: "address",
		secureTextEntry: false,
		icon: "road-variant",
	},
	{
		label: "Quận/huyện",
		field: "district",
		secureTextEntry: false,
		icon: "home-city",
	},
	{
		label: "Tỉnh thành",
		field: "province",
		secureTextEntry: false,
		icon: "city",
	},
];
// STEP 3: Thông tin dãy trọ đầu tiên
const step3 = [
	{
		label: "Tên tài sản",
		field: "property_name",
	},
	{
		label: "Địa chỉ tài sản",
		field: "property_address",
	},
	{
		label: "Địa chỉ phường tài sản",
		field: "property_ward",
	},
	{
		label: "Địa chỉ quận tài sản",
		field: "property_district",
	},
	{
		label: "Địa chỉ tỉnh tài sản",
		field: "property_province",
	},
	{
		label: "Ảnh dãy trọ",
		field: "property_upload_images",
		type: "images",
	},
];

const RegisterLandlord = () => {
	const style = useStyle();
	const theme = useTheme();
	const [step, setStep] = useState(1); // State dùng cho
	const [user, setUser] = useState({});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [propertyImages, setPropertyImages] = useState([]);

	/**
	 * Lấy các trường thông tin tại step hiện tại
	 */
	const getFields = () => {
		if (step === 1) return step1;
		if (step === 2) return step2;
		if (step === 3) return step3;
		return [];
	};

	const updateUserField = (value, field) => {
		setUser({ ...user, [field]: value });
		setErrors({ ...errors, [field]: undefined });
	};

	// Chọn avatar
	const pickAvatar = async () => {
		let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("Bạn cần cấp quyền truy cập ảnh!");
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync();
		if (!result.canceled) {
			updateUserField(result.assets[0], "avatar");
		}
	};

	// Xoá ảnh avatar hiện tại
	const onRemoveAvatar = () => setUser({ ...user, avatar: undefined });

	// Chọn ảnh dãy trọ
	const pickPropertyImages = async () => {
		let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("Bạn cần cấp quyền truy cập ảnh!");
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync({
			allowsMultipleSelection: true,
			quality: 0.7,
		});
		if (!result.canceled) {
			setPropertyImages(result.assets);
			setUser({ ...user, property_upload_images: result.assets });
		}
	};

	const validate = () => {
		let newErrors = {};
		let valid = true;

		for (let i of getFields()) {
			if (i.type === "images") {
				if (i.required !== false && !propertyImages.length) {
					newErrors[i.field] = "Vui lòng chọn ít nhất 1 ảnh!";
					valid = false;
				}
			} else if (
				i.required !== false &&
				(!user[i.field] || user[i.field].toString().trim() === "")
			) {
				newErrors[i.field] = `Vui lòng nhập ${i.label.toLowerCase()}!`;
				valid = false;
			}
		}

		if (step === 1 && user.password !== user.confirm) {
			newErrors.confirm = "Mật khẩu xác nhận không khớp!";
			valid = false;
		}
		setErrors(newErrors);
		return valid;
	};

	const register = async () => {
		if (!validate()) return;
		try {
			setLoading(true);

			let form = new FormData(); // Tạo dữ liệu form data

			for (const key in user) {
				// Các trường vớ vẩn không có trong thông tin đăng ký bỏ qua
				if (key === "confirm" || user[key] === undefined || user[key] === null)
					continue;

				// Xử lý trường avatar
				if (key === "avatar") {
					if (user.avatar && user.avatar.uri) {
						form.append("avatar", {
							uri: user.avatar.uri,
							name: user.avatar.fileName || "avatar.jpg",
							type: "image/jpeg",
						});
					}
					continue;
				}

				// Xử lý trường các hình ảnh dãy trọ
				if (key === "property_upload_images" && Array.isArray(user[key])) {
					user[key].forEach((img, idx) => {
						form.append("property_upload_images", {
							uri: img.uri,
							name: img.fileName || `property_${idx}.jpg`,
							type: "image/jpeg",
						});
					});
					continue;
				}

				// Các trường khác nhập vào luôn
				form.append(key, user[key]);
			}

			await Apis.post(endpoints["landlord-register"], form, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			alert("Đăng ký thành công!");
		} catch (ex) {
			console.log(ex.response?.data || ex.toJSON?.() || ex);
			alert("Đăng ký thất bại. Vui lòng thử lại!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<BottomSafeAreaView>
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 4 }}
				enableOnAndroid={true}
				extraScrollHeight={240}
			>
				<Text
					style={[style.title_big, { textAlign: "center", marginBottom: 12 }]}
				>
					{step == 1 && "Thông tin căn bản"}
					{step == 2 && "Thông tin cá nhân"}
					{step == 3 && "Dãy trọ đầu tiên"}
				</Text>
				{getFields().map((info) =>
					info.type === "images" ? (
						// Trường chọn ảnh dãy trọ
						<ImagesPicker
							key={info.field}
							images={propertyImages}
							onPick={pickPropertyImages}
							error={errors[info.field]}
							label="Thêm ảnh dãy trọ"
						/>
					) : info.type === "avatar" ? (
						// Trường avatar
						<AvatarPicker
							key={info.field}
							avatar={user.avatar}
							onPick={pickAvatar}
							onRemove={onRemoveAvatar}
						/>
					) : info.type === "date" ? (
						// Trường ngày tháng
						<DatePicker
							key={info.field}
							label={info.label}
							value={user[info.field]}
							onChange={(date) => updateUserField(date, info.field)}
							error={errors.dob}
						/>
					) : (
						// Các trường khác
						<InputField
							key={info.field}
							label={info.label}
							value={user[info.field]}
							onChangeText={(value) => updateUserField(value, info.field)}
							secureTextEntry={info.secureTextEntry}
							icon={info.icon}
							error={errors[info.field]}
						/>
					)
				)}

				{/* Các nút điều hướng */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginTop: 16,
					}}
				>
					{step > 1 && (
						<Button mode="outlined" onPress={() => setStep(step - 1)}>
							Quay lại
						</Button>
					)}
					{step < 3 ? (
						<Button
							mode="contained"
							onPress={() => validate() && setStep(step + 1)}
						>
							Tiếp tục
						</Button>
					) : (
						<Button
							mode="contained"
							onPress={register}
							loading={loading}
							disabled={loading}
						>
							Đăng ký
						</Button>
					)}
				</View>
			</KeyboardAwareScrollView>
		</BottomSafeAreaView>
	);
};

export default RegisterLandlord;
