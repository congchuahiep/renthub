import { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import RentalPostCard from "../components/RentalPostCard";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";



const RentalList = () => {
	// Style
	const theme = useTheme();
	const style = useStyle();
	// Các state hiệu ứng
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	// State lưu dữ liệu
	const [rentalPosts, setRentalPosts] = useState([]);

	const loadRentalPosts = async () => {
		setLoading(true);

		await Apis.get(endpoints['rentals'])
			.then(res => {
				setRentalPosts(res.data.results)
			})
			.catch(err => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
				setRefreshing(false);
			});
	}

	useEffect(() => {
		loadRentalPosts();
	}, [])

	const onRefresh = () => {
		setRefreshing(true);
		loadRentalPosts();
	}

	return (
		<>
			<FlatList
				style={[style.container]}
				data={rentalPosts}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={[theme.colors.primary]}
						progressBackgroundColor={theme.colors.background}
					/>}
				renderItem={({ item }) =>
					<RentalPostCard
						id={item.post.id}
						title={item.title}
						area={item.area}
						images={item.post.images}
						price={item.price}
						address={item.property.district + ", " + item.property.province}
						numberOfBed={item.number_of_bedrooms}
						numberOfBathroom={item.number_of_bathrooms}
					/>
				}
				ListEmptyComponent={!loading && rentalPosts && <Text>Hiện tại không có bài đăng nào cả 🥲</Text>}
				ListFooterComponent={loading ? <ActivityIndicator /> : <View style={{ height: 8 }} />}
			/>
		</>

	)
}

export default RentalList;