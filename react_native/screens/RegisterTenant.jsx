import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Card, useTheme } from "react-native-paper";
import BottomSafeAreaView from "../components/BottomSafeAreaView";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";
import { registerTenantDataForm } from "../form_data/registerTenantDataForm";
import { renderFormField } from "../utils/form";
import { useSnackbar } from "../config/snackbar";

const RegisterTenant = ({ navigation }) => {
	const snackbar = useSnackbar();
	const style = useStyle();

	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	// Phương thức thiết lập giá trị cho các thông tin đăng ký người dùng
	const updateDataForm = (field, value) => {
		setFormData({ ...formData, [field]: value });
		setErrors({ ...errors, [field]: undefined });
	};

	const handleValidate = () => {
		const fields = registerTenantDataForm;
		const newErrors = {};
		let isValid = true;

		fields.forEach((field) => {
			const value = formData[field.field];

			switch (field.field) {
				case "number_of_bathrooms":
				case "number_of_bedrooms":
				case "limit_person":
					if (!value || value < 1) {
						newErrors[field.field] = `${field.label} phải lớn hơn 0`;
						isValid = false;
					}
					break;

				case "confirm_password":
					if (!value || formData.password !== value) {
						newErrors[field.field] = "Mật khẩu xác nhận không khớp!";
						isValid = false;
					}
					break;

				default:
					if (
						field.required !== false &&
						(!value || value.toString().trim() === "")
					) {
						newErrors[
							field.field
						] = `Vui lòng nhập ${field.label.toLowerCase()}`;
						isValid = false;
					}
			}
		});

		setErrors(newErrors);
		return isValid;
	};

	/**
	 * Xử lý đăng ký người dùng
	 */
	const registerHandle = async () => {
		console.log("User data:", formData);
		if (!handleValidate()) return; // Validate dữ liệu đăng ký

		try {
			setLoading(true);

			// Tạo form
			let form = new FormData();

			for (const key in formData) {
				if (
					key === "confirm" ||
					formData[key] === undefined ||
					formData[key] === null
				)
					continue;
				if (key === "avatar") {
					if (formData.avatar && formData.avatar.uri) {
						form.append("avatar", {
							uri: formData.avatar.uri,
							name: formData.avatar.fileName || "avatar.jpg",
							type: "image/jpeg",
						});
					}
					continue;
				}
				form.append(key, formData[key]);
			}
			console.log(form.data);

			// Tiến hành chạy api đăng ký người dùng
			await Apis.post(endpoints.tenantRegister, form, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			navigation.navigate("Home", {
				screen: "Login",
				params: {
					message: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.",
				},
			});
		} catch (error) {
			if (error.response?.data) {
				const apiErrors = {};
				if (error.response.data.email) {
					apiErrors.email = "Email đã được sử dụng";
				}
				if (error.response.data.username) {
					apiErrors.username = "Tên đăng nhập đã tồn tại";
				}
				setErrors(apiErrors);
			} else {
				snackbar("Có lỗi xảy ra, vui lòng thử lại!");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<BottomSafeAreaView>
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{
					paddingHorizontal: 16,
					paddingBottom: 32,
					gap: 4,
				}}
				enableOnAndroid={true}
				extraScrollHeight={160}
			>
				<Card style={style.card}>
					<Card.Content>
						{registerTenantDataForm.map((field) =>
							renderFormField({
								field,
								formData,
								error: errors[field.field],
								updateField: (value) => updateDataForm(field.field, value),
								navigation,
							})
						)}
					</Card.Content>
				</Card>

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
