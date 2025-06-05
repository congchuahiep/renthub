import { getHeaderTitle } from "@react-navigation/elements";
import { Appbar, Searchbar, useTheme } from "react-native-paper";
import useStyle from "../styles/useStyle";
import { useGoogleAutocomplete } from "@appandflow/react-native-google-autocomplete";
import { useRef } from "react";

export default function RentalMapAppbar({
	navigation,
	route,
	options,
	back,
	setTerm,
	searchRef,
	setShowAutocomplete,
	onSubmit,
}) {
	const title = getHeaderTitle(options, route.name);
	const theme = useTheme();
	const style = useStyle();

	return (
		<Appbar.Header
			mode="center-aligned"
			style={{ backgroundColor: "#00000000" }}
		>
			{back ? (
				<Appbar.BackAction
					style={{ borderRadius: 16, backgroundColor: theme.colors.background }}
					onPress={navigation.goBack}
					color={theme.colors.onSurfaceVariant}
				/>
			) : (
				<Appbar.Action
					onPress={() =>
						console.log(
							"Hôm nay bạn đẹp trai lắm ^^: " +
								process.env.EXPO_PUBLIC_DJANGO_SERVER_URL
						)
					}
				/>
			)}

			{/* <Appbar.Content title={title} /> */}
			<Searchbar
				ref={searchRef}
				placeholder="Tìm kiếm..."
				onChangeText={(text) => {
					setTerm(text);
					setShowAutocomplete(true);
				}}
				onSubmitEditing={({ nativeEvent }) => {
					onSubmit(nativeEvent.text);
					setShowAutocomplete(false);
				}}
				style={{
					flex: 1,
					height: 42,
					borderRadius: 32,
					backgroundColor: theme.colors.background,
				}}
				iconColor={theme.colors.onSurfaceVariant}
				inputStyle={{ minHeight: 42, height: 42 }}
			/>
			<Appbar.Action
				style={{ borderRadius: 16, backgroundColor: theme.colors.background }}
				icon="filter-outline"
			/>
		</Appbar.Header>
	);
}
