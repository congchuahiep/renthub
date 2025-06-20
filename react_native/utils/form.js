import {
	launchImageLibraryAsync,
	requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import AvatarPicker from "../components/form/AvatarPicker";
import DatePicker from "../components/form/DatePicker";
import ImagesPicker from "../components/form/ImagesPicker";
import InputField from "../components/form/InputField";
import ScreenPickerButton from "../components/form/ScreenPickerButton";
import Counter from "../components/form/Counter";

export const renderFormField = ({
	field,
	error,
	updateField,
	formData,
	navigation,
}) => {
	if (field.hidden) return null;

	const key = field.field;
	const label = field.label;
	const value = formData[key];
	const returnScreen = field.returnScreen;

	const dependentValue = field.dependsOn ? formData?.[field.dependsOn] : null;

	const handlePickImage = async (multiple = false) => {
		const { status } = await requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("Bạn cần cấp quyền truy cập ảnh!");
			return;
		}

		const result = await launchImageLibraryAsync({
			allowsMultipleSelection: multiple,
			quality: 0.7,
		});

		if (!result.canceled) {
			if (multiple) {
				updateField(result.assets);
			} else {
				updateField(result.assets[0]);
			}
		}
	};

	switch (field.type) {
		case "avatar":
			return (
				<AvatarPicker
					key={key}
					avatar={value}
					onPick={() => handlePickImage(false)}
					onRemove={() => updateField(undefined)}
					error={error}
				/>
			);

		case "counter":
			return (
				<Counter
					key={key}
					label={label}
					value={value}
					error={error}
					onChange={updateField}
					{...field}
				/>
			);

		case "date":
			return (
				<DatePicker
					key={key}
					label={label}
					value={value}
					onChange={updateField}
					error={error}
				/>
			);

		case "images":
			return (
				<ImagesPicker
					key={key}
					images={value || null}
					onPick={() => handlePickImage(true)}
					error={error}
					label={field.label}
				/>
			);

		case "region":
		case "street":
			const navigationParams = field.dependsOn
				? { region_address: dependentValue }
				: {};
		case "property": {
			const navigationMap = {
				region: "RegionAddressSelect",
				street: "StreetAddressSelect",
				property: "PropertySelect",
			};

			const navigateTo = navigationMap[field.type];

			console.log(dependentValue);

			const disabled = field.dependsOn && !dependentValue;
			const disabledText = disabled ? "Chọn tỉnh/huyện/xã trước" : undefined;

			return (
				<ScreenPickerButton
					key={key}
					label={label}
					value={value}
					onPress={() =>
						navigation.navigate(navigateTo, {
							returnScreen,
							...navigationParams,
						})
					}
					disabled={disabled}
					disabledText={disabledText}
					error={error}
				/>
			);
		}

		default:
			return (
				<InputField
					key={field.field}
					label={field.label}
					value={value}
					onChangeText={updateField}
					error={error}
					{...field}
				/>
			);
	}
};
