import { FlatList, View } from "react-native";
import {
	ActivityIndicator,
	Avatar,
	Button,
	Card,
	Divider,
	Text,
	useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useStyle from "../styles/useStyle";
import BottomSafeAreaView from "../components/BottomSafeAreaView";
import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { authApis, endpoints } from "../config/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileDetail = ({ route }) => {
	const theme = useTheme();
	const style = useStyle();

	const { userData } = route.params;

	const [propertys, setProperties] = useState([]);
	const [propertyLoading, setPropertyLoading] = useState(true);

	const loadProperty = async () => {
		try {
			setPropertyLoading(true);
			const token = await AsyncStorage.getItem("token");
			const res = await authApis(token).get(endpoints.propertiesUserList);

			console.log(res.data);
			setProperties(res.data.results);
		} catch (ex) {
			console.log(ex);
		} finally {
			setPropertyLoading(false);
		}
	};

	useEffect(() => {
		loadProperty();
	}, []);

	const InfoItem = ({ icon, label, value }) => (
		<View style={{ flexDirection: "row", alignItems: "center" }}>
			<MaterialCommunityIcons
				name={icon}
				size={24}
				color={theme.colors.primary}
				style={{ marginRight: 12 }}
			/>
			<View>
				<Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 2 }}>
					{label}
				</Text>
				<Text style={{ fontSize: 16, fontWeight: "500" }}>
					{value || "Chưa cập nhật"}
				</Text>
			</View>
		</View>
	);

	return (
		<BottomSafeAreaView style={style.container}>
			<Card style={style.card}>
				<Card.Content>
					<View style={{ alignItems: "center", paddingVertical: 24 }}>
						<Avatar.Image
							size={120}
							source={userData?.avatar ? { uri: userData.avatar } : null}
							style={{ marginBottom: 4, elevation: 4 }}
						/>
						<Text style={[style.title_big, style.text_primary_dark]}>
							{userData.first_name} {userData.last_name}
						</Text>
						<Text style={{ fontSize: 16, opacity: 0.7 }}>
							{userData.user_type === "tenant" ? "Người thuê" : "Chủ trọ"}
						</Text>
					</View>
					<Divider style={{ marginHorizontal: 16 }} />
					<View style={{ paddingHorizontal: 32, paddingVertical: 16, gap: 16 }}>
						<InfoItem icon="email" label="Email" value={userData.email} />
						<InfoItem
							icon="phone"
							label="Số điện thoại"
							value={userData.phone}
						/>
						<InfoItem
							icon="map-marker"
							label="Địa chỉ"
							value={userData.address}
						/>
					</View>
				</Card.Content>
			</Card>

			{userData.user_type === "landlord" && (
				<View style={{ marginTop: 16 }}>
					<Text
						style={[
							style.title_small,
							style.text_primary,
							{ marginBottom: 4 },
						]}
					>
						Danh sách dãy trọ
					</Text>
					<FlatList
						data={propertys}
						renderItem={({ item }) => (
							<PropertyCard
								mode="small"
								name={item.name}
								images={item.images}
								address={
									item.address + ", " + item.district + ", " + item.province
								}
							/>
						)}
						ListEmptyComponent={() => {
							return propertyLoading ? (
								<ActivityIndicator />
							) : (
								<Text>Chủ nhà này không có dãy trọ nào :'(</Text>
							);
						}}
					/>
				</View>
			)}
			{/* <Button onPress={() => console.log(userData)}>USER DATA</Button> */}
		</BottomSafeAreaView>
	);
};

export default ProfileDetail;
