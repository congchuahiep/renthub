import { FlatList, Text } from "react-native"
import { Button } from "react-native-paper";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../config/Apis";

const Rental = () => {

	const [rentalPosts, setRentalPosts] = useState([]);

	const loadRentalPost = async () => {
		console.log("Chạy trong")

		const response = await Apis.get(endpoints['rentals'])
			.then(res => {
				console.log(res.data);
				setRentalPosts(res.data.results)
			})
			.catch(err => {
				console.log(err);
			});

		// console.log(response.data);
		// setRentalPosts(response.data.results);
	}

	useEffect(() => {
		console.log("Chạy ngoài")
		loadRentalPost();
	}, [])

	return (
		<>
			<FlatList
				data={rentalPosts}
				renderItem={({ item }) =>
					<Post title={item.title} content={item.content} />
				}
			/>
			<Button icon="camera" mode="contained" onPress={() => console.log(rentalPosts)}>
				Nhấn
			</Button>
		</>

	)
}

export default Rental;