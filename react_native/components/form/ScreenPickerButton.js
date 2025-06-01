import { TouchableOpacity, View } from "react-native";
import { HelperText, Text, useTheme } from "react-native-paper";

const ScreenPickerButton = ({
	value,
	label,
	onPress,
	style,
	error,
	disabled,
	disabledText = "Chưa chọn",
}) => {
	const theme = useTheme();
	return (
		<View style={{ marginVertical: 4 }}>
			<TouchableOpacity
				style={[
					style,
					{
						borderWidth: error ? 2 : 1,
						borderColor: error ? theme.colors.error : theme.colors.secondary,
						borderRadius: 4,
						borderRadius: 4,
						padding: 12,
						flexDirection: "row",
						alignItems: "center",
						gap: 8,
						opacity: disabled ? 0.6 : 1,
					},
				]}
				onPress={disabled ? null : onPress}
				disabled={disabled}
			>
				<Text
					style={{
						fontWeight: "bold",
						color: error ? theme.colors.error : theme.colors.primary,
					}}
				>
					{label}
				</Text>
				<View style={{ flex: 1 }}>
					{value ? (
						<Text>{value}</Text>
					) : disabled ? (
						<Text>{disabledText}</Text>
					) : (
						<Text style={{ color: theme.colors.secondary }}>Chưa chọn</Text>
					)}
				</View>
			</TouchableOpacity>
			{error && (
				<HelperText type="error" visible={!!error}>
					{error}
				</HelperText>
			)}
		</View>
	);
};

export default ScreenPickerButton;
