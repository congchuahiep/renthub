import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { authApis, endpoints } from "../../config/Apis";
import BottomSafeAreaView from "../../components/BottomSafeAreaView";
import useStyle from "../../styles/useStyle";
import { ActivityIndicator, Text } from "react-native-paper";
import PropertyCard from "../../components/PropertyCard";

const PropertySellect = ({ navigation, route }) => {
	const style = useStyle();

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

	const handleSelected = (property) => {
		navigation.popTo(route.params.returnScreen, {
			property_id: property.id,
			property_name: property.name,
		});
	};

	return (
		<BottomSafeAreaView style={style.container}>
			<FlatList
				data={propertys}
				renderItem={({ item }) => (
					<PropertyCard
						mode="small"
						name={item.name}
						images={item.images}
						address={item.address + ", " + item.district + ", " + item.province}
						onPress={() => handleSelected(item)}
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
		</BottomSafeAreaView>
	);
};

export default PropertySellect;