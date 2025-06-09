import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Card, Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

import BottomSafeAreaView from "../components/BottomSafeAreaView";
import StepBottomBar from "../components/StepBottomBar";
import { stepFields, stepsInfo } from "../form_data/registerLandlordDataForm";
import { renderFormField } from "../utils/form";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";
import { useSnackbar } from "../config/snackbar";

const RegisterLandlord = ({ navigation, route }) => {
	// Refs cho animation
	const flatListRef = useRef(null);
	const scrollX = useRef(new Animated.Value(0)).current;
	const { width } = Dimensions.get("window");
	const style = useStyle();

	const snackbar = useSnackbar();

	// States
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

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

			if (ward && district && province && region_address) {
				setFormData((prev) => ({
					...prev,
					property_ward: ward,
					property_district: district,
					property_province: province,
					property_region_address: region_address,
				}));
			}

			if (street_address && latitude && longitude) {
				setFormData((prev) => ({
					...prev,
					property_address: street_address,
					property_latitude: latitude,
					property_longitude: longitude,
				}));
			}
		}
	}, [route?.params]);

	// Các hàm xử lý
	const goToStep = (stepIndex) => {
		if (stepIndex < 0 || stepIndex >= stepsInfo?.length) return;

		flatListRef.current?.scrollToIndex({
			index: stepIndex,
			animated: true,
		});
		setCurrentStep(stepIndex);
	};

	const updateField = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const handleValidateStep = () => {
		const fields = stepFields[currentStep];
		const newErrors = {};
		let isValid = true;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^(0|84|\+84)([0-9]{9}|[0-9]{10})$/;

		fields.forEach((field) => {
			const value = formData[field.field];

			console.log(field);

			switch (field.field) {
				case "confirm_password":
					if (!value || formData.password !== value) {
						newErrors[field.field] = "Mật khẩu xác nhận không khớp!";
						isValid = false;
					}
					break;

				case "email":
					if (!emailRegex.test(value)) {
						newErrors.email = "Email không hợp lệ";
						isValid = false;
					}
					break;

				case "phone_number":
					if (!phoneRegex.test(value)) {
						newErrors.phone_number = "Số điện thoại không hợp lệ";
						isValid = false;
					}
					break;

				case "property_upload_images":
					if (!value || value?.length < 3) {
						newErrors[field.field] = "Vui lòng chọn ít nhất 3 ảnh về dãy trọ!";
						isValid = false;
					}
					break;

				case "property_region_address":
					if (
						!formData.property_ward ||
						!formData.property_district ||
						!formData.property_province
					) {
						newErrors[field.field] = "Vui lòng chọn tỉnh/huyện/xã";
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
	 * Xử lý hoàn tất đăng ký
	 */
	const handleSubmit = async () => {
		console.log("HẢ");

		if (!handleValidateStep()) {
			console.log("Validate thất bại");
			return;
		}

    console.log("HẢ @@");

		try {
			setLoading(true);
			const formDataToSend = new FormData();

			// Append form data
			Object.entries(formData).forEach(([key, value]) => {
				if (value === undefined || value === null || key === "confirm") return;

				if (key === "avatar" && value?.uri) {
					formDataToSend.append("avatar", {
						uri: value.uri,
						name: value.fileName || "avatar.jpg",
						type: "image/jpeg",
					});
				} else if (key === "property_upload_images" && Array.isArray(value)) {
					value.forEach((img, idx) => {
						formDataToSend.append("property_upload_images", {
							uri: img.uri,
							name: img.fileName || `property_${idx}.jpg`,
							type: "image/jpeg",
						});
					});
				} else {
					formDataToSend.append(key, value);
				}
			});

			await Apis.post(endpoints.landlordRegister, formDataToSend, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			navigation.navigate("Home", {
				screen: "Login",
				params: {
					message:
						"Tài khoản của bạn đã được đăng ký thành công! Tuy nhiên chung tôi cần vài ngày để xử lý xét duyệt tài khoản của bạn, một khi hoàn tất chúng tôi sẽ thông báo cho bạn qua email.",
				},
			});
		} catch (error) {
			if (error.response?.data) {
				const apiErrors = {};
				if (error.response.data.email) {
					apiErrors.email = "Email đã được sử dụng";
					goToStep(1);
				}
				if (error.response.data.username) {
					apiErrors.username = "Tên đăng nhập đã tồn tại";
					goToStep(1);
				}
				setErrors(apiErrors);
			} else {
				snackbar("Có lỗi xảy ra, vui lòng thử lại!");
			}
		} finally {
			setLoading(false);
		}
	};

	// Render form field
	const renderStep = ({ item, index }) => {
		const fields = stepFields[index];

		return (
			<KeyboardAwareScrollView
				style={{ width }}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ padding: 16 }}
				enableOnAndroid
			>
				<Card style={style.card}>
					<Card.Content>
						<Text variant="titleMedium" style={style.text_secondary}>
							{item.title}
						</Text>
						{item.description && (
							<Text style={{ marginVertical: 8 }}>{item.description}</Text>
						)}

						{fields.map((field) =>
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
		);
	};

	return (
		<BottomSafeAreaView>
			<Animated.FlatList
				ref={flatListRef}
				data={stepsInfo}
				renderItem={renderStep}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				scrollEventThrottle={16}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { x: scrollX } } }],
					{ useNativeDriver: true }
				)}
				scrollEnabled={false}
			/>

			<Button onPress={() => console.log(formData)}>DATA</Button>
			<Button onPress={() => console.log(errors)}>ERROR</Button>

			<StepBottomBar
				step={currentStep + 1} // Vì currentStep bắt đầu từ 0, cần +1 để khớp với step từ 1
				steps={stepsInfo} // Truyền mảng steps trực tiếp
				onBack={() => goToStep(currentStep - 1)}
				onNext={() => {
					if (handleValidateStep()) {
						if (currentStep === stepsInfo.length - 1) {
							handleSubmit();
						} else {
							goToStep(currentStep + 1);
						}
					}
				}}
				onFinish={handleSubmit}
				loading={loading}
			/>
		</BottomSafeAreaView>
	);
};

export default RegisterLandlord;
