import { GoogleMaps } from "expo-maps";
import BottomSafeAreaView from "../components/BottomSafeAreaView";
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../config/Apis";
import { Button } from "react-native-paper";

const RentalPostMapping = () => {
	const [rentalPostMarkers, setRentalPostMarkers] = useState([]);

	const loadRentalPost = async () => {
		try {
			const res = await Apis.get(endpoints.rentals);

			setRentalPostMarkers(
				res.data.results.map((post) => {
					const latitude = post?.property?.latitude;
					const longitude = post?.property?.longitude;

					if (typeof latitude === "number" && typeof longitude === "number") {
						return {
							coordinates: {
								latitude,
								longitude,
							},
						};
					}

					return null;
				})
			);
		} catch (ex) {
			console.log(ex);
		}
	};

	useEffect(() => {
		loadRentalPost();
	}, []);

	return (
		<BottomSafeAreaView style={{ flex: 1 }}>
			<GoogleMaps.View
				style={{ flex: 1 }}
				cameraPosition={{
					coordinates: { latitude: 16.15, longitude: 106 },
					zoom: 6,
				}}
				markers={rentalPostMarkers}
			/>
      <Button onPress={() => console.log(rentalPostMarkers)}>TEST</Button>
		</BottomSafeAreaView>
	);
};

export default RentalPostMapping;
