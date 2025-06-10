import { useNavigation } from "@react-navigation/native";
import { Avatar, Card, Icon, Text, useTheme } from "react-native-paper";
import useStyle from "../styles/useStyle";
import Carousel from "./Carousel";
import { Image, TouchableOpacity, View } from "react-native";

const PropertyCard = ({
	id,
	title,
	images,
	name,
	address,
	onPress = () => {},
	mode = "default",
}) => {
	const navigation = useNavigation();

	const style = useStyle();
	const theme = useTheme();

	if (mode === "small") {
		return (
			<TouchableOpacity
				style={[
					style.card,
					{
						marginVertical: 4,
						padding: 12,
						flexDirection: "row",
						alignItems: "center",
					},
				]}
				activeOpacity={0.8}
				onPress={onPress}
			>
				{images ? (
					<Image
						source={{ uri: images[0]?.image }}
						style={{ width: 82, height: 82, marginRight: 12, borderRadius: 4 }}
					/>
				) : (
					<Avatar.Text
						size={56}
						label="?"
						style={{ marginRight: 12, borderRadius: 4 }}
					/>
				)}

				<View style={{ flex: 1 }}>
					<Text
						style={{
							color: theme.colors.primary,
							fontWeight: 700,
							marginBottom: 2,
						}}
					>
						{name}
					</Text>
					<Text style={{ opacity: 0.8 }}>{address}</Text>
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<Card style={style.card}>
			<Card.Content>
				{images && <Carousel images={images} />}

				<TouchableOpacity
					onPress={() => navigation.navigate("PropertyDetail", { id })}
					style={{ marginHorizontal: 8, marginTop: 5 }}
				>
					<Text style={[style.title_small, { marginBottom: 5 }]}>{name}</Text>
					<Text
						variant="bodyMedium"
						style={{ color: theme.colors.secondary, marginBottom: 5 }}
					>
						<Icon
							source={"map-marker-outline"}
							size={16}
							color={theme.colors.secondary}
						/>
						{address}
					</Text>
				</TouchableOpacity>
			</Card.Content>
		</Card>
	);
};

export default PropertyCard;
