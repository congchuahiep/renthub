import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, View } from "react-native";
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
import AvatarPicker from "../components/form/AvatarPicker";
import InputField from "../components/form/InputField";

// CÁC TRƯỜNG THÔNG TIN ĐĂNG KÝ TÀI KHOẢN TÌM TRỌ
export const tenantInfo = [
	{
		label: "Ảnh đại diện",
		field: "avatar",
		secureTextEntry: true,
		required: false,
		icon: "eye",
		type: "avatar",
	},
	{
		label: "Tên",
		field: "first_name",
		secureTextEntry: false,
	},
	{
		label: "Họ và tên lót",
		field: "last_name",
		secureTextEntry: false,
	},
	{
		label: "Tên đăng nhập",
		field: "username",
		secureTextEntry: false,
		icon: "account-circle",
	},
	{
		label: "Email",
		field: "email",
		secureTextEntry: false,
		icon: "email",
		keyboardType: "email-address",
	},
	{
		label: "Mật khẩu",
		field: "password",
		secureTextEntry: true,
		icon: "eye",
	},
	{
		label: "Xác nhận mật khẩu",
		field: "confirm",
		secureTextEntry: true,
		icon: "eye",
	},
];

const RegisterTenant = () => {
	const style = useStyle();
	const theme = useTheme();
	const [user, setUser] = useState({});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	// Phương thức thiết lập giá trị cho các thông tin đăng ký người dùng
	const updateUserField = (value, field) => {
		setUser({ ...user, [field]: value });
		setErrors({ ...errors, [field]: undefined });
	};

	// Chọn ảnh avatar
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

	const validate = () => {
		let newErrors = {};
		let valid = true;
		for (let i of tenantInfo) {
			if (!user[i.field] || user[i.field].toString().trim() === "") {
				newErrors[i.field] = `Vui lòng nhập ${i.label.toLowerCase()}!`;
				valid = false;
			}
		}
		if (user.password !== user.confirm) {
			newErrors.confirm = "Mật khẩu xác nhận không khớp!";
			valid = false;
		}
		setErrors(newErrors);
		return valid;
	};

	/**
	 * Xử lý đăng ký người dùng
	 */
	const registerHandle = async () => {
		if (!validate()) return; // Validate dữ liệu đăng ký

		try {
			setLoading(true);

			// Tạo form
			let form = new FormData();

			for (const key in user) {
				if (key === "confirm" || user[key] === undefined || user[key] === null)
					continue;
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
				form.append(key, user[key]);
			}

			// Tiến hành chạy api đăng ký người dùng
			await Apis.post(endpoints.tenantRegister, form, {
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
				extraScrollHeight={160}
			>
				{/* Map từng trường thông tin một */}
				{tenantInfo.map((info) =>
					info.type === "avatar" ? (
						// Nếu là trường avatar
						<AvatarPicker
							key={info.field}
							avatar={user.avatar}
							onPick={pickAvatar}
							onRemove={onRemoveAvatar}
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
							keyboardType={info.keyboardType}
						/>
					)
				)}

				<Button
					onPress={registerHandle}
					disabled={loading}
					loading={loading}
					mode="contained"
					style={{ marginTop: 16, borderRadius: 8 }}
				>
					Đăng ký
				</Button>
			</KeyboardAwareScrollView>
		</BottomSafeAreaView>
	);
};

export default RegisterTenant;
