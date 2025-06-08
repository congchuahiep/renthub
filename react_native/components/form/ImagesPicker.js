import { Image, View } from "react-native";
import { Button, HelperText, useTheme } from "react-native-paper";

const ImagesPicker = ({ images, onPick, error, label }) => {
	const theme = useTheme();

	return (
		<View
			style={{
				marginVertical: 4,
				borderColor: theme.colors.secondary,
			}}
		>
			<Button
				mode="outlined"
				onPress={onPick}
				icon="camera"
			>
				{label || "Chọn ảnh"}
			</Button>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					marginTop: 8,
				}}
			>
				{images && images.map((img, idx) => (
					<Image
						key={idx}
						source={{ uri: img.uri }}
						style={{
							width: 64,
							height: 64,
							marginRight: 8,
							borderRadius: 4,
							marginBottom: 8,
						}}
					/>
				))}
			</View>
			{error && (
				<HelperText type="error" visible={!!error}>
					{error}
				</HelperText>
			)}
		</View>
	);
};

export default ImagesPicker;
