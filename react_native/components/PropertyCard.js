import { useNavigation } from "@react-navigation/native";
import { Card, Text, useTheme } from "react-native-paper";
import useStyle from "../styles/useStyle";
import Carousel from "./Carousel";
import { View } from "react-native";

const PropertyCard = ({
	id,
	title,
	images,
	name,
	address,
	mode = "default",
}) => {
	const navigation = useNavigation();

	const style = useStyle();
	const theme = useTheme();

	const toPropertyDetail = () => {
		navigation.navigate("propertyDetail", { id: id, name: name });
	};

	if (mode === "small") {
		return (
			<View
				style={{
					marginVertical: 4,
					borderWidth: 1,
					padding: 12,
					borderRadius: 4,
					borderColor: theme.colors.secondary,
                    backgroundColor: theme.colors.elevation.level1
				}}
			>
				<Text style={{ color: theme.colors.primary, fontWeight: 700 }}>
					{title}
				</Text>
				<Text>{name}</Text>
			</View>
		);
	}

	return (
		<Card style={style.card}>
			<Card.Content>{images && <Carousel images={images} />}</Card.Content>
		</Card>
	);
};

export default PropertyCard;
