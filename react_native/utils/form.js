import InputField from "../components/form/InputField";
import AvatarPicker from "../components/form/AvatarPicker";
import DatePicker from "../components/form/DatePicker";
import ImagesPicker from "../components/form/ImagesPicker";
import ScreenPickerButton from "../components/form/ScreenPickerButton";

export const renderFormField = ({
	field,
	value,
	error,
	onChange,
	onImagePick,
	propertyImages,
	navigation,
	formData,
	returnScreen,
	style,
}) => {
	if (field.hidden) return null;

	switch (field.type) {
		case "avatar":
			return (
				<AvatarPicker
					key={field.field}
					avatar={value}
					onPick={() => onImagePick(false)}
					onRemove={() => onChange(undefined)}
					error={error}
				/>
			);

		case "date":
			return (
				<DatePicker
					key={field.field}
					label={field.label}
					value={value}
					onChange={onChange}
					error={error}
				/>
			);

		case "images":
			return (
				<ImagesPicker
					key={field.field}
					images={propertyImages}
					onPick={() => onImagePick(true)}
					error={error}
					label={field.label}
				/>
			);

		case "region":
			return (
				<ScreenPickerButton
					key={field.field}
					label={field.label}
					value={formData.property_region_address}
					onPress={() =>
						navigation.navigate("RegionAddressSelect", {
							returnScreen,
						})
					}
					error={error}
				/>
			);

		case "street":
			return (
				<ScreenPickerButton
					key={field.field}
					label={field.label}
					value={value}
					onPress={() =>
						navigation.navigate("StreetAddressSelect", {
							returnScreen,
							region_address: formData.property_region_address,
						})
					}
					disabled={!formData.property_region_address}
					disabledText="Chọn tỉnh/huyện/xã trước"
					error={error}
				/>
			);

		case "property":
			return (
				<ScreenPickerButton
					key={field.field}
					label={field.label}
					value={value}
					onPress={() =>
						navigation.navigate("PropertySelect", {
							returnScreen,
						})
					}
					error={error}
				/>
			);

		default:
			return (
				<InputField
					key={field.field}
					label={field.label}
					value={value}
					onChangeText={onChange}
					error={error}
					{...field}
				/>
			);
	}
};
