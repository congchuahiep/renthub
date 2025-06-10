import { useEffect, useState } from "react";
import { Button, Icon, Text, useTheme, Card } from "react-native-paper";
import useStyle from "../styles/useStyle";
import Apis, { endpoints } from "../config/Apis";
import BottomSafeAreaView from "../components/BottomSafeAreaView";
import { ScrollView, View } from "react-native";
import Carousel from "../components/Carousel";
import { GoogleMaps } from "expo-maps";

const PropertyDetail = ({ route }) => {
	const theme = useTheme();
	const style = useStyle();

	const { id } = route.params;

	const [property, setProperty] = useState();
	const [loading, setLoading] = useState(false);

	const loadProperty = async () => {
		try {
			setLoading(true);
			const res = await Apis.get(endpoints.propertyDetails(id));

			setProperty(res.data);
		} catch (ex) {
			console.log(ex);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadProperty();
	}, []);

	return (
		<BottomSafeAreaView>
			{property ? (
				<View style={{ flex: 1 }}>
					<ScrollView style={[style.container]}>
						{/* KHUNG XEM ẢNH */}
						<View
							style={[
								style.box_shadow,
								{
									marginTop: 16,
									marginBottom: 8,
									borderWidth: 2,
									borderRadius: 10,
									borderColor: theme.colors.secondary,
								},
							]}
						>
							<Carousel images={property.images} />
						</View>
						<Card style={[style.card]}>
							<Card.Title
								title={property.name}
								titleStyle={[style.title_big, { color: theme.colors.primary }]}
							/>
							<Card.Content style={{ color: theme.colors.secondary }}>
								<View
									style={{
										flex: 1,
										flexDirection: "row",
										alignItems: "flex-start",
										gap: 5,
										marginBottom: "6",
									}}
								>
									<Icon
										source="map-marker-outline"
										size={20}
										color={theme.colors.secondary}
										style={{}}
									/>
									<Text
										variant="bodyMedium"
										style={{ color: theme.colors.secondary, flexShrink: 1 }}
									>
										{property.address}, {property.ward}, {property.district},{" "}
										{property.province}
									</Text>
								</View>

								<View style={{ height: 480 }}>
									<GoogleMaps.View
										style={{
											flex: 1,
											borderRadius: 6,
											flexShrink: 1,
											marginTop: 12,
										}}
										cameraPosition={{
											coordinates: {
												latitude: property.latitude,
												longitude: property.longitude,
											},
											zoom: 15,
										}}
										markers={[
											{
												coordinates: {
													latitude: property.latitude,
													longitude: property.longitude,
												},
												title: property.name,
											},
										]}
										uiSettings={{
											myLocationButtonEnabled: false,
										}}
									/>
								</View>
							</Card.Content>
						</Card>

					</ScrollView>
				</View>
			) : (
				<></>
			)}
			<Button onPress={() => console.log(property)}>DATA</Button>
		</BottomSafeAreaView>
	);
};

export default PropertyDetail;
