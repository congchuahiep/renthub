import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import PropertyCard from "../components/PropertyCard";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";

const PropertyList = () => {
	const theme = useTheme();
	const style = useStyle();
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const loadPropertyList = async () => {
		try {
			setLoading(true); // Bắt đầu tải dữ liệu
			let response = await Apis.get(endpoints.properties);
			setProperties(response.data); // Lưu dữ liệu vào state
		} catch (ex) {
			console.error(ex);
		} finally {
			setLoading(false); // Kết thúc tải dữ liệu
			setRefreshing(false);
		}
	};

	useEffect(() => {
		loadPropertyList();
	}, []);
	const onRefresh = () => {
		setRefreshing(true);
		loadPropertyList();
	};

	return (
		<FlatList
			style={[style.container]}
			data={properties}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					colors={[theme.colors.primary]}
					progressBackgroundColor={theme.colors.background}
				/>
			}
			renderItem={({ item }) => (
				<PropertyCard
					id={item.id}
					name={item.name}
					images={item.images}
					address={item.address}
				/>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: "#f9f9f9",
	},
	card: {
		backgroundColor: "#fff",
		padding: 15,
		marginBottom: 10,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
	},
	address: {
		fontSize: 14,
		color: "#555",
		marginBottom: 5,
	},
	owner: {
		fontSize: 14,
		color: "#888",
	},
});

export default PropertyList;
