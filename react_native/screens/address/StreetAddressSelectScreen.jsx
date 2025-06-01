import { useGoogleAutocomplete } from "@appandflow/react-native-google-autocomplete";
import * as Location from "expo-location";
import { GoogleMaps } from "expo-maps";
import { useEffect, useRef, useState } from "react";
import {
	FlatList,
	Keyboard,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { TextInput, useTheme, Text, Divider, Button } from "react-native-paper";
import BottomSafeAreaView from "../../components/BottomSafeAreaView";

const StreetAddressSelectScreen = ({ route, navigation }) => {
	const { region_address } = route.params;

	const theme = useTheme();

	const inputRef = useRef(null);

	const [places, setPlaces] = useState([]);
	const [coordinates, setCoordinates] = useState(null);
	const [marker, setMarker] = useState();

	const [showAutocomplete, setShowAutocomplete] = useState(false);

	// Khởi tạo autocomplete
	const { locationResults, setTerm, searchDetails, term } =
		useGoogleAutocomplete(process.env.EXPO_PUBLIC_GOOGLE_MAP_AUTOCOMPLETE_API, {
			language: "vi",
			lat: coordinates ? coordinates.latitude : null,
			lng: coordinates ? coordinates.longitude : null,
			radius: "1000",
			strictBounds: true,
			components: "country:vn",
		});

	// Cập nhật địa chỉ khởi tạo
	useEffect(() => {
		// Lấy tọa độ từ địa chỉ ban đầu
		const loadLocation = async () => {
			try {
				// Xin quyền truy cập vị trí
				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== "granted") return;

				// Lấy toạ độ từa địa chỉ ban đầu
				const res = await Location.geocodeAsync(region_address);
				if (res.length > 0) {
					setCoordinates({
						latitude: res[0].latitude,
						longitude: res[0].longitude,
					});
				}
			} catch (error) {
				console.error("Geocoding error:", error);
			}
		};

		loadLocation();
	}, [region_address]);

	// Cập nhật toạ độ marker theo coordiantes
	useEffect(() => {
		if (coordinates) {
			setMarker({ ...coordinates });
		}
	}, [coordinates]);

	// Cập nhật danh sách kết quả
	useEffect(() => {
		if (Array.isArray(locationResults)) {
			setPlaces([...locationResults]);
		}
	}, [locationResults]);

	// Xử lý việc lấy toạ độ từ địa chỉ người nhập
	const handlePlaceSelect = async (place) => {
		console.log("Selected place:", place.structured_formatting?.main_text);

		const placeDetails = await searchDetails(place.place_id);

		setMarker({
			latitude: placeDetails.geometry.location.lat,
			longitude: placeDetails.geometry.location.lng,
		});

		setCoordinates({
			latitude: placeDetails.geometry.location.lat,
			longitude: placeDetails.geometry.location.lng,
		});

		setTerm(place.structured_formatting?.main_text);

		setShowAutocomplete(false);

		inputRef.current?.blur();
	};

	// Thêm hàm xử lý khi nhấn "ok" trên keyboard
	const handleInputSubmit = async () => {
		try {
			if (term) {
				// Thử geocoding địa chỉ vừa nhập
				const results = await Location.geocodeAsync(
					term + ", " + region_address
				);

				if (results.length > 0) {
					const newLocation = {
						latitude: results[0].latitude,
						longitude: results[0].longitude,
					};

					// Cập nhật marker và camera
					setMarker(newLocation);
					setCoordinates(newLocation);
					setShowAutocomplete(false);
					inputRef.current?.blur();
				}
			}
		} catch (error) {
			console.error("Geocoding error:", error);
		}
	};

	// Xử lý trả về dữ liệu
	const handleSubmit = () => {
		navigation.popTo(route.params.returnScreen, {
			street_address: term,
			latitude: marker.latitude,
			longitude: marker.longitude,
		});
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<BottomSafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
				<TextInput
					ref={inputRef}
					label="Nhập số nhà, tên đường..."
					value={term}
					onChangeText={(text) => {
						setTerm(text);
						setShowAutocomplete(true); // Hiện autocomplete khi gõ
					}}
					onSubmitEditing={handleInputSubmit}
				/>

				<View style={{ flex: 1, position: "relative" }}>
					{showAutocomplete && Array.isArray(places) && places.length > 0 && (
						<FlatList
							style={{
								position: "absolute",
								zIndex: 10,
								width: "100%",
								paddingHorizontal: 8,
							}}
							keyboardShouldPersistTaps="handled"
							data={places.slice(0, 3)}
							keyExtractor={(_, index) => index.toString()}
							renderItem={({ item }) => (
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => handlePlaceSelect(item)}
									style={{
										padding: 10,
										backgroundColor: theme.colors.primaryContainer,
									}}
								>
									<Text>{item.structured_formatting?.main_text}</Text>
									<Text style={{ fontSize: 12 }}>
										{item.structured_formatting?.secondary_text}
									</Text>
								</TouchableOpacity>
							)}
							ItemSeparatorComponent={() => <Divider />}
						/>
					)}
					{coordinates && (
						<GoogleMaps.View
							style={{
								flex: 1,
								borderBottomLeftRadius: 8,
								borderBottomRightRadius: 8,
								flexShrink: 1,
							}}
							cameraPosition={{
								coordinates: {
									latitude: coordinates.latitude,
									longitude: coordinates.longitude,
								},
								zoom: 14,
							}}
							markers={[
								{
									coordinates: marker || coordinates,
									title: "Vị trí dãy trọ",
									snippet: "Bấm vào một chỗ khác để đặt lại vị trí dãy trọ",
								},
							]}
							onMapClick={(e) => {
								// Cập nhật vị trí marker khi người dùng nhấn giữ
								console.log(e);
								setMarker(e);
							}}
						/>
					)}

					<Button
						mode="contained"
						style={{ marginTop: 8 }}
						onPress={handleSubmit}
					>
						Xác nhận
					</Button>
				</View>
			</BottomSafeAreaView>
		</TouchableWithoutFeedback>
	);
};

export default StreetAddressSelectScreen;
