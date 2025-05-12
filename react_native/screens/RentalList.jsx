import { FlatList, Text, View } from "react-native"
import { ActivityIndicator, Button } from "react-native-paper";
import RentalPostCard from "../components/RentalPostCard";
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../config/Apis";
import spacing from "../styles/spacing";
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import useStyle from "../styles/useStyle";



const RentalList = () => {

	const style = useStyle();

	const [rentalPosts, setRentalPosts] = useState([]);
	const [loading, setLoading] = useState(false);

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
			});
	}

	useEffect(() => {
		loadRentalPosts();
	}, [])

	return (
		<>
			<FlatList
				style={[style.container]}
				data={rentalPosts}
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
				ListEmptyComponent={loading ? <ActivityIndicator /> : <View style={{height: 8}} />}
				ListFooterComponent={loading ? <ActivityIndicator /> : <View style={{height: 8}} />}
			/>
		</>

	)
}

export default RentalList;