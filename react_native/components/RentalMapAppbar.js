import { Appbar, Searchbar, useTheme } from "react-native-paper";
import useStyle from "../styles/useStyle";

export default function RentalMapAppbar({
	navigation,
	back,
	setTerm,
	searchRef,
	setShowAutocomplete,
	onSubmit,
	isFiltered,
	setShowFilterModal,
}) {
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
				icon={isFiltered ? "filter" : "filter-outline"}
				color={isFiltered ? theme.colors.surface : theme.colors.onSurface}
				style={[
					style.box_shadow,
					{
						backgroundColor: isFiltered
							? theme.colors.primary
							: theme.colors.background,
						borderWidth: 1,
						borderColor: theme.colors.secondary,
						borderRadius: 16,
					},
				]}
				onPress={() => {
					setShowFilterModal(true);
				}}
			/>
		</Appbar.Header>
	);
}
