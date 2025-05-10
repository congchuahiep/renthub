import { FlatList, Text } from "react-native"
import { Button } from "react-native-paper";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../config/Apis";
import spacing from "../styles/spacing";

const Rental = () => {

	const [rentalPosts, setRentalPosts] = useState([]);

	const loadRentalPost = async () => {
		console.log("Chạy trong")

		await Apis.get(endpoints['rentals'])
			.then(res => {
				console.log(res.data);
				setRentalPosts(res.data.results)
			})
			.catch(err => {
				console.log(err);
			});
	}

	useEffect(() => {
		console.log("Chạy ngoài")
		loadRentalPost();
	}, [])

	return (
		<>
			<FlatList
				style={spacing.p_20}
				data={rentalPosts}
				renderItem={({ item }) =>
					<Post title={item.title} content={item.content} images={item.post.images} price={item.price} />
				}
			/>
		</>

	)
}

export default Rental;