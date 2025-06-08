import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Card, Text, useTheme } from "react-native-paper";
import BottomSafeAreaView from "../components/BottomSafeAreaView";
import { propertyDataForm } from "../form_data/propertyDataForm";
import useStyle from "../styles/useStyle";
import { renderFormField } from "../utils/form";
import { authApis, endpoints } from "../config/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PropertyCreate = ({ navigation, route }) => {
	const theme = useTheme();
	const style = useStyle();
	const { width } = Dimensions.get("window");

	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});
	const [submitLoading, setSubmitLoading] = useState(false);

	// Nhận params từ màn hình chọn địa chỉ
	useEffect(() => {
		if (route?.params) {
			const {
				ward,
				district,
				province,
				region_address,
				street_address,
				latitude,
				longitude,
			} = route.params;

			console.log(route.params);

			if (ward && district && province && region_address) {
				setFormData((prev) => ({
					...prev,
					ward,
					district,
					province,
					region_address,
				}));
			}

			if (street_address && latitude && longitude) {
				setFormData((prev) => ({
					...prev,
					address: street_address,
					latitude,
					longitude,
				}));
			}
		}
	}, [route?.params]);

	useEffect(() => {
		updateField("address", null);
	}, [formData.region_address]);

	const updateField = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const handleValidate = () => {
		const newErrors = {};
		let isValid = true;

		propertyDataForm.forEach((field) => {
			const value = formData[field.field];

			switch (field.field) {
				case "upload_images":
					if (!formData.upload_images || formData.upload_images?.length < 3) {
						newErrors[field.field] = "Vui lòng chọn ít nhất 3 ảnh về dãy trọ";
						isValid = false;
					}
					return;
				case "region_address":
					if (!formData.ward || !formData.district || !formData.province) {
						newErrors[field.field] = "Vui lòng chọn tỉnh/huyện/xã";
						isValid = false;
					}
					return;
				default:
					if (
						field.required !== false &&
						(!value || value.toString().trim() === "")
					) {
						newErrors[
							field.field
						] = `Vui lòng nhập ${field.label.toLowerCase()}`;
						isValid = false;
						return;
					}
			}
		});

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async () => {
		console.log(formData);
		if (!handleValidate()) return;

		try {
			setSubmitLoading(true);
			const formDataToSend = new FormData();

			// Thêm các trường bình thường
			for (const [key, value] of Object.entries(formData)) {
				if (key === "upload_images") continue;
				if (value !== null && value !== undefined) {
					formDataToSend.append(key, String(value));
				}
			}

			// Thêm ảnh
			formData.upload_images.forEach((image, index) => {
				formDataToSend.append("upload_images", {
					uri: image.uri,
					type: image.mimeType,
					name: image.fileName || `image_${index}.jpg`,
				});
			});

			console.log(formDataToSend);

			const token = await AsyncStorage.getItem("token");
			await authApis(token).post(endpoints.properties, formDataToSend, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			navigation.popToTop();
			alert("Đăng ký dãy trọ thành công!");
		} catch (error) {
			console.error(error);
			alert("Có lỗi xảy ra khi đăng ký dãy trọ!");
		} finally {
			setSubmitLoading(false);
		}
	};

	return (
		<BottomSafeAreaView>
			<KeyboardAwareScrollView
				style={{ width }}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ padding: 16, flex: 1 }}
				enableOnAndroid
			>
				<Card style={style.card}>
					<Card.Content>
						<Text variant="titleMedium" style={style.text_secondary}>
							Thêm dãy trọ mới
						</Text>
						<Text style={{ marginVertical: 8 }}>
							Vui lòng điền đầy đủ thông tin về dãy trọ mà bạn muốn đăng ký, bao
							gồm ít nhất 3 hình ảnh rõ nét của dãy trọ. Sau khi hoàn tất đăng
							ký, chúng tôi sẽ tiến hành xác minh thông tin trong vài ngày. Kết
							quả xác minh sẽ được thông báo đến bạn qua email. Xin cảm ơn!
						</Text>
						{propertyDataForm.map((field) =>
							renderFormField({
								field,
								formData,
								error: errors[field.field],
								updateField: (value) => updateField(field.field, value),
								navigation,
							})
						)}
					</Card.Content>
				</Card>
			</KeyboardAwareScrollView>
			<View
				style={[
					style.bottomBar,
					{
						flexDirection: "row",
						justifyContent: "flex-end",
						alignItems: "center",
						padding: 12,
						borderTopWidth: 1,
						borderColor: theme.colors.secondary,
						backgroundColor: theme.colors.onSecondary,
					},
				]}
			>
				<Button
					mode="contained"
					onPress={handleSubmit}
					disabled={submitLoading}
					loading={submitLoading}
				>
					Đăng ký
				</Button>
			</View>
		</BottomSafeAreaView>
	);
};

export default PropertyCreate;
