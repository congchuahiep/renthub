import { View, Image, StyleSheet } from "react-native";
import { Button, HelperText, IconButton, useTheme } from "react-native-paper";

const AvatarPicker = ({ avatar, onPick, onRemove, error }) => {
	const theme = useTheme();

	return (
		<View style={styles.container}>
			<View style={styles.avatarWrapper}>
				<Image
					source={
						avatar && avatar.uri
							? { uri: avatar.uri }
							: require("../../assets/no-avatar.jpg")
					}
					style={{
						width: 96,
						height: 96,
						borderRadius: 48,
						borderWidth: 2,
						borderColor: error ? theme.colors.error : theme.colors.outline,
						backgroundColor: theme.colors.primary,
						marginBottom: 8,
					}}
					resizeMode="cover"
				/>
				{avatar && avatar.uri && (
					<IconButton
						icon="close"
						size={20}
						style={styles.removeBtn}
						onPress={onRemove}
						accessibilityLabel="Xoá ảnh đại diện"
					/>
				)}

				{error && (
					<HelperText type="error" visible={!!error}>
						{error}
					</HelperText>
				)}
				<Button
					mode="contained"
					icon="camera"
					onPress={onPick}
					style={styles.button}
					labelStyle={{ fontSize: 14 }}
					compact
				>
					Chọn ảnh đại diện
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		marginVertical: 16,
	},
	avatarWrapper: {
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
	},
	avatar: {
		width: 96,
		height: 96,
		borderRadius: 48,
		borderWidth: 2,
		borderColor: "#ccc",
		backgroundColor: "#f2f2f2",
		marginBottom: 8,
	},
	button: {
		borderRadius: 20,
		paddingHorizontal: 12,
		marginTop: 4,
	},
	removeBtn: {
		position: "absolute",
		top: -16,
		right: 24,
		backgroundColor: "#fff",
    borderWidth: 1,
		zIndex: 2,
	},
});

export default AvatarPicker;
