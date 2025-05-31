import { View, Image } from "react-native";
import { Button, HelperText } from "react-native-paper";

const ImagesPicker = ({ images, onPick, error, label }) => (
	<View style={{ marginBottom: 8 }}>
		<Button mode="outlined" onPress={onPick} icon="camera">
			{label || "Chọn ảnh"}
		</Button>
		<View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
			{images.map((img, idx) => (
				<Image
					key={idx}
					source={{ uri: img.uri }}
					style={{
						width: 64,
						height: 64,
						marginRight: 8,
						borderRadius: 8,
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

export default ImagesPicker;
