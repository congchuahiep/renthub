import { View, Platform } from "react-native";
import { TextInput, HelperText, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

const formatDate = (date) => {
	if (!date) return "";
	const d = new Date(date);
	return d.toLocaleDateString("vi-VN");
};

const DatePicker = ({
	label,
	value,
	onChange,
	error,
	style,
	...props
}) => {
	const [show, setShow] = useState(false);

	const onChangeDate = (event, selectedDate) => {
		setShow(false);
		if (selectedDate) {
			onChange(selectedDate.toISOString().split("T")[0]);
		}
	};

	return (
		<View style={{ marginBottom: 8 }}>
			<TextInput
				label={label}
				value={formatDate(value)}
				onFocus={() => setShow(true)}
				right={<TextInput.Icon icon="calendar" onPress={() => setShow(true)} />}
				editable={false}
				mode="outlined"
				error={!!error}
				style={style}
				{...props}
			/>
			{show && (
				<DateTimePicker
					value={value ? new Date(value) : new Date()}
					mode="date"
					display={Platform.OS === "ios" ? "spinner" : "default"}
					onChange={onChangeDate}
					maximumDate={new Date()}
				/>
			)}
			{error && (
				<HelperText type="error" visible={!!error}>
					{error}
				</HelperText>
			)}
		</View>
	);
};

export default DatePicker;
