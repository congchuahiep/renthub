import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Card, Text } from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSafeAreaView from "../components/BottomSafeAreaView";
import StepBottomBar from "../components/StepBottomBar";
import UtilitySelector from "../components/form/UtilitySelector";
import Apis, { authApis, endpoints } from "../config/Apis";
import { stepFields, stepsInfo } from "../form_data/createRentalDataForm";
import useStyle from "../styles/useStyle";
import { renderFormField } from "../utils/form";

const RentalCreate = ({ navigation, route }) => {
	const style = useStyle();
	const flatListRef = useRef(null);
	const scrollX = useRef(new Animated.Value(0)).current;
	const { width } = Dimensions.get("window");

	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({});

	const [errors, setErrors] = useState({});
	const [submitLoading, setSubmitLoading] = useState(false);

	const [rentalImages, setRentalImages] = useState([]);
	const [utilities, setUtilities] = useState([]);
	const [selectedUtilities, setSelectedUtilities] = useState([]);

	const updateDataForm = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const loadUtilities = async () => {
		try {
			const res = await Apis.get(endpoints.utilities);
			setUtilities(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		loadUtilities();
	}, []);

	// Nhận params từ màn hình chọn dãy trọ
	useEffect(() => {
		if (route?.params) {
			const { property_id, property_name } = route.params;

			if (property_id && property_name) {
				setFormData((prev) => ({
					...prev,
					property_id,
					property_name,
				}));
			}
		}
	}, [route?.params]);

	const handlePickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("Bạn cần cấp quyền truy cập ảnh!");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			allowsMultipleSelection: true,
			quality: 0.7,
		});

		if (!result.canceled) {
			setRentalImages(result.assets);
			updateDataForm("upload_images", result.assets);
		}
	};

	const handleGoToStep = (stepIndex) => {
		if (stepIndex < 0 || stepIndex >= stepsInfo?.length) return;

		flatListRef.current?.scrollToIndex({
			index: stepIndex,
			animated: true,
		});
		setCurrentStep(stepIndex);
	};

	const handleToggleUtility = (utilityId) => {
		setSelectedUtilities((prev) => {
			const isSelected = prev.includes(utilityId);
			if (isSelected) {
				return prev.filter((id) => id !== utilityId);
			}
			return [...prev, utilityId];
		});
		setErrors((prev) => ({ ...prev, utilities_ids: undefined }));
	};

	const handleValidateStep = () => {
		const fields = stepFields[currentStep];
		const newErrors = {};
		let isValid = true;

		fields.forEach((field) => {
			const value = formData[field.field];

			if (
				field.required !== false &&
				(!value || value.toString().trim() === "")
			) {
				newErrors[field.field] = `Vui lòng nhập ${field.label.toLowerCase()}`;
				isValid = false;
			}
		});

		setErrors(newErrors);
		return isValid;
	};

	/**
	 * Kế xuất các trang theo step
	 */
	const renderStep = ({ item, index }) => {
		const step = index + 1;

		if (step === 3) {
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
							<Text style={{ marginVertical: 8 }}>{item.description}</Text>
							<UtilitySelector
								height={360}
								utilities={utilities}
								selectedIds={selectedUtilities}
								onToggle={handleToggleUtility}
								error={errors.utilities_ids}
							/>
						</Card.Content>
					</Card>
				</KeyboardAwareScrollView>
			);
		}

		return (
			<KeyboardAwareScrollView
				style={{ width }}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ paddingHorizontal: 16 }}
				enableOnAndroid
			>
				<Card style={style.card}>
					<Card.Content>
						<Text variant="titleMedium" style={style.text_secondary}>
							{item.title}
						</Text>
						<Text style={{ marginVertical: 8 }}>{item.description}</Text>
						{stepFields[index].map((field) =>
							renderFormField({
								field,
								value: formData[field.field],
								error: errors[field.field],
								onChange: (value) => updateDataForm(field.field, value),
								onImagePick: handlePickImage,
								propertyImages: rentalImages,
								navigation: navigation,
								returnScreen: "RentalCreate",
								style,
							})
						)}
					</Card.Content>
				</Card>
			</KeyboardAwareScrollView>
		);
	};

	const handleSubmit = async () => {
		if (!formData.property_id) {
			alert("Không tìm thấy thông tin dãy trọ!");
			return;
		}

		try {
			setSubmitLoading(true);
			const formDataToSend = new FormData();

			Object.entries(formData).forEach(([key, value]) => {
				if (value === undefined || value === null) return;

				if (key === "upload_images" && Array.isArray(value)) {
					value.forEach((img, idx) => {
						formDataToSend.append("upload_images", {
							uri: img.uri,
							name: img.fileName || `rental_${idx}.jpg`,
							type: "image/jpeg",
						});
					});
				} else {
					formDataToSend.append(key, value);
				}
			});

			selectedUtilities.forEach((id) => {
				formDataToSend.append("utilities_ids", id);
			});

			console.log(formDataToSend);

			const token = await AsyncStorage.getItem("token");
			await authApis(token).post(endpoints.rentals, formDataToSend, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			navigation.goBack();
		} catch (error) {
			console.error(error);
			alert("Có lỗi xảy ra khi tạo bài đăng!");
		} finally {
			setSubmitLoading(false);
		}
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

			{/* <Button onPress={() => console.log(formData)}>DATA</Button> */}

			<StepBottomBar
				step={currentStep + 1}
				steps={stepsInfo}
				onBack={() => handleGoToStep(currentStep - 1)}
				onNext={() => handleValidateStep() && handleGoToStep(currentStep + 1)}
				onFinish={handleSubmit}
				loading={submitLoading}
			/>
		</BottomSafeAreaView>
	);
};

export default RentalCreate;
