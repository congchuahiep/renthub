import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Card, Text, useTheme } from "react-native-paper";
import BottomSafeAreaView from "../components/BottomSafeAreaView";
import AvatarPicker from "../components/form/AvatarPicker";
import DatePicker from "../components/form/DatePicker";
import ScreenPickerButton from "../components/form/FullScreenSelector";
import ImagesPicker from "../components/form/ImagesPicker";
import InputField from "../components/form/InputField";
import StepBottomBar from "../components/StepBottomBar";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";

// CÁC TRƯỜNG ĐĂNG KÝ TÀI KHOẢN CHỦ TRỌ ĐƯỢC CHIA LÀM 3 BƯỚC

// STEP 1: Thông tin căn bản (giống thông tin đăng ký người dùng tìm trọ)
const step1 = [
	{
		label: "Ảnh đại diện",
		field: "avatar",
		required: false,
		icon: "eye",
		type: "avatar",
	},
	{
		label: "Tên",
		field: "first_name",
	},
	{
		label: "Họ và tên lót",
		field: "last_name",
	},
];

const step2 = [
	{
		label: "Tên đăng nhập",
		field: "username",
		icon: "account-circle",
	},
	{
		label: "Email",
		field: "email",
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

// STEP 2: Thông tin cá nhân
const step3 = [
	{
		label: "Số điện thoại",
		field: "phone_number",
		icon: "phone",
		keyboardType: "phone-pad",
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
		icon: "card-account-details",
	},
	{
		label: "Đường",
		field: "address",
		icon: "road-variant",
	},
	{
		label: "Quận/huyện",
		field: "district",
		icon: "home-city",
	},
	{
		label: "Tỉnh thành",
		field: "province",
		icon: "city",
	},
];
// STEP 4: Thông tin dãy trọ đầu tiên
const step4 = [
	{
		label: "Tên tài sản",
		field: "property_name",
	},
	{
		label: "Địa chỉ phường tài sản",
		field: "property_ward",
		hidden: true,
	},
	{
		label: "Địa chỉ quận tài sản",
		field: "property_district",
		hidden: true,
	},
	{
		label: "Địa chỉ tỉnh tài sản",
		field: "property_province",
		hidden: true,
	},
	{
		label: "Chọn tỉnh/huyện/xã",
		field: "region_address",
		type: "region",
	},
	{
		label: "Địa chỉ tài sản",
		field: "property_address",
		type: "street",
	},
	{
		label: "Ảnh dãy trọ",
		field: "property_upload_images",
		type: "images",
	},
];

// Thông tin hiển thị các step
const stepsInfo = [
	{ title: "Thông tin căn bản" },
	{ title: "Thông tin đăng nhập" },
	{ title: "Thông tin cá nhân" },
	{
		title: "Dãy trọ đầu tiên",
		description:
			"Chúng tôi yêu cầu người dùng loại chủ trọ khi mới tạo cần cung cấp ít nhất thông tin về 1 dãy trọ hiện tại mà bạn đang sở hữu",
	},
];

const RegisterLandlord = ({ navigation, route }) => {
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
		if (step === 4) return step4;
		return [];
	};

	const updateUserField = (value, field) => {
		setUser({ ...user, [field]: value });
		setErrors({ ...errors, [field]: undefined });
	};

	// Nhận các giá trị địa chỉ từ hai màn hình chọn địa chỉ
	useEffect(() => {
		console.log(route.params);

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

			console.log(ward);

			if (ward && district && province && region_address) {
				setUser((prev) => ({
					...prev,
					property_ward: ward,
					property_district: district,
					property_province: province,
					property_region_address: region_address,
				}));
			}

			if (street_address && latitude && longitude) {
				setUser((prev) => ({
					...prev,
					property_address: street_address,
					property_latitude: latitude,
					property_longitude: longitude,
				}));
			}
		}
	}, [route?.params]);

	const validate = () => {
		let newErrors = {};
		let valid = true;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^(0|84|\+84)([0-9]{9}|[0-9]{10})$/;

		for (let info of getFields()) {
			if (info.hidden || info.required == false) {
				continue;
			}

			// Validate email
			if (info.field === "email") {
				if (!emailRegex.test(user.email)) {
					newErrors.email = "Email không hợp lệ!";
					valid = false;
				}
			}

			// Validate phone number
			if (info.field === "phone_number") {
				if (!phoneRegex.test(user.phone_number)) {
					newErrors.phone_number = "Số điện thoại không hợp lệ!";
					valid = false;
				}
			}

			if (info.type === "images") {
				if (!propertyImages.length) {
					newErrors[info.field] = "Vui lòng chọn ít nhất 1 ảnh!";
					valid = false;
				}
			} else if (info.type === "region") {
				if (
					!user["property_ward"] ||
					!user["property_district"] ||
					!user["property_province"]
				) {
					newErrors[info.field] = "Vui chọn tỉnh/huyện/xã!";
					valid = false;
				}
			} else if (
				!user[info.field] ||
				user[info.field].toString().trim() === ""
			) {
				newErrors[info.field] = `Vui lòng nhập ${info.label.toLowerCase()}!`;
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

	// Chọn avatar
	const handlePickAvatar = async () => {
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
	const handleRemoveAvatar = () => setUser({ ...user, avatar: undefined });

	// Chọn ảnh dãy trọ
	const handlePickPropertyImages = async () => {
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

	const handleRegister = async () => {
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
			// Xử lý lỗi từ API
			if (ex.response?.data) {
				const apiErrors = ex.response.data;
				const newErrors = {};

				// Xử lý lỗi email
				if (apiErrors.email) {
					newErrors.email = "Email này đã được sử dụng";
					setStep(2); // Quay về step có trường email
				}

				// Xử lý lỗi username
				if (apiErrors.username) {
					newErrors.username = "Tên tài khoản này đã tồn tại";
					setStep(2); // Quay về step có trường username
				}

				setErrors(newErrors);
			} else {
				// Lỗi khác
				alert("Đăng ký thất bại. Vui lòng thử lại!");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleRegionAddressSelect = () => {
		navigation.navigate("RegionAddressSelect", {
			returnScreen: "RegisterLandlord",
		});
	};

	const handleStreetAddressSelect = () => {
		navigation.navigate("StreetAddressSelect", {
			returnScreen: "RegisterLandlord",
			region_address: user.property_region_address,
		});
	};

	return (
		<BottomSafeAreaView>
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 4 }}
				enableOnAndroid={true}
				extraScrollHeight={24}
			>
				<Card style={style.card}>
					<Card.Content>
						<Text style={[style.title_small, style.text_secondary]}>
							{stepsInfo[step - 1].title}
						</Text>
						<Text style={{ marginBottom: 8 }}>
							{stepsInfo[step - 1].description}
						</Text>

						{getFields().map((info) =>
							info.type === "images" ? (
								// Trường chọn ảnh dãy trọ
								<ImagesPicker
									key={info.field}
									images={propertyImages}
									onPick={handlePickPropertyImages}
									error={errors[info.field]}
									label="Thêm ảnh dãy trọ"
								/>
							) : info.type === "avatar" ? (
								// Trường avatar
								<AvatarPicker
									key={info.field}
									avatar={user.avatar}
									onPick={handlePickAvatar}
									onRemove={handleRemoveAvatar}
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
							) : info.type === "region" ? (
								// Trường chọn tỉnh/huyện/xã
								<ScreenPickerButton
									key={info.field}
									label={"Tỉnh/huyện/xã"}
									value={user.property_region_address}
									onPress={() => {
										setErrors((prev) => ({ ...prev, [info.field]: undefined }));
										handleRegionAddressSelect();
									}}
									error={errors[info.field]}
								/>
							) : info.type === "street" ? (
								// Trường chọn số nhà, hiển thị bản đồ cụ thể
								<ScreenPickerButton
									key={info.field}
									label={"Địa chỉ cụ thể"}
									value={user.property_address}
									onPress={() => {
										setErrors((prev) => ({ ...prev, [info.field]: undefined }));
										handleStreetAddressSelect();
									}}
									disabled={!user.property_region_address}
									error={errors[info.field]}
								/>
							) : (
								!info.hidden && (
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
							)
						)}
					</Card.Content>
				</Card>
			</KeyboardAwareScrollView>
			<StepBottomBar
				step={step}
				steps={stepsInfo}
				onBack={() => setStep(step - 1)} // Chạy khi quay lại
				onNext={() => validate() && setStep(step + 1)} // Chạy khi chuyển sang step tiếp theo
				onFinish={handleRegister} // Chạy khi thành công
				loading={loading}
			/>
		</BottomSafeAreaView>
	);
};

export default RegisterLandlord;
