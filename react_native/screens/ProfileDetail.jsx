import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import {
	ActivityIndicator,
	Avatar,
	Card,
	Divider,
	Text,
	useTheme,
} from "react-native-paper";
import BottomSafeAreaView from "../components/BottomSafeAreaView";
import PropertyCard from "../components/PropertyCard";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";

const ProfileDetail = ({ navigation, route }) => {
	const theme = useTheme();
	const style = useStyle();

	const { userData } = route.params;

	const [user, setUser] = useState({});

	const [propertys, setProperties] = useState([]);
	const [propertyLoading, setPropertyLoading] = useState(true);

	const loadUser = async () => {
		try {
			const res = await Apis.get(endpoints.user(userData.id));
			setUser(res.data);
		} catch (ex) {
			console.log(ex);
		}
	};

	const loadProperty = async () => {
		try {
			setPropertyLoading(true);
			const res = await Apis.get(endpoints.propertiesOfUser(userData.id));

			console.log(res.data);
			setProperties(res.data.results);
		} catch (ex) {
			console.log(ex);
		} finally {
			setPropertyLoading(false);
		}
	};

	useEffect(() => {
		loadUser();
	}, []);

	useEffect(() => {
		if (user.user_type !== "landlord") return;
		loadProperty();
	}, [user]);

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
		<BottomSafeAreaView>
			<ScrollView style={style.container}>
				<Card style={style.card}>
					<Card.Content>
						<View style={{ alignItems: "center", paddingVertical: 24 }}>
							<Avatar.Image
								size={120}
								source={user?.avatar ? { uri: user.avatar } : null}
								style={{ marginBottom: 4, elevation: 4 }}
							/>
							<Text style={[style.title_big, style.text_primary_dark]}>
								{user.first_name} {user.last_name}
							</Text>
							<Text style={{ fontSize: 16, opacity: 0.7 }}>
								{user.user_type === "tenant" ? "Người thuê" : "Chủ trọ"}
							</Text>
						</View>
						<Divider style={{ marginHorizontal: 16 }} />
						<View
							style={{ paddingHorizontal: 32, paddingVertical: 16, gap: 16 }}
						>
							<InfoItem icon="email" label="Email" value={user.email} />
							<InfoItem icon="phone" label="Số điện thoại" value={user.phone} />
							<InfoItem
								icon="map-marker"
								label="Địa chỉ"
								value={user.address}
							/>
						</View>
					</Card.Content>
				</Card>
				{user.user_type === "landlord" && (
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
						{propertys.length > 0 ? (
							propertys.map((item) => (
								<PropertyCard
									key={item.id}
									mode="small"
									name={item.name}
									images={item.images}
									address={
										item.address + ", " + item.district + ", " + item.province
									}
									onPress={() =>
										navigation.navigate("PropertyDetail", {
											id: item.id,
										})
									}
								/>
							))
						) : propertyLoading ? (
							<ActivityIndicator />
						) : (
							<Text>Chủ nhà này không có dãy trọ nào :'(</Text>
						)}
					</View>
				)}
			</ScrollView>
		</BottomSafeAreaView>
	);
};

export default ProfileDetail;
