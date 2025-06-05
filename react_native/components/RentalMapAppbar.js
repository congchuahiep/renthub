import { getHeaderTitle } from "@react-navigation/elements";
import { Appbar, Searchbar, useTheme } from "react-native-paper";
import useStyle from "../styles/useStyle";

export default function RentalMapAppbar({ navigation, route, options, back }) {
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
				placeholder="Tìm kiếm..."
				// onChangeText={setSearchQuery}
				// value={searchQuery}
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
