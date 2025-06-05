import { useState } from "react";
import {
	Appbar,
	Button,
	Icon,
	Menu,
	Modal,
	Portal,
	Searchbar,
	Text,
} from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { useTheme } from "react-native-paper";
import useStyle from "../styles/useStyle";
import { useAuth } from "../config/auth";
import { View } from "react-native";

export default function RentalAppbar({
	navigation,
	route,
	options,
	back,
	setShowFilterModal,
	isFiltered,
}) {
	const theme = useTheme();
	const style = useStyle();

	const { user } = useAuth();

	const title = getHeaderTitle(options, route.name);

	return (
		<Appbar.Header
			mode="center-aligned"
			style={{ backgroundColor: "transparent" }}
		>
			{back ? (
				<Appbar.BackAction onPress={navigation.goBack} />
			) : (
				<Appbar.Action
					onPress={() => {
						console.log(
							"Hôm nay bạn đẹp trai lắm ^^: " +
								process.env.EXPO_PUBLIC_DJANGO_SERVER_URL
						);
						console.log(user);
					}}
				/>
			)}

			{!back ? (
				<>
					<Button
						mode="outlined"
						style={[
							style.box_shadow,
							{
								flex: 1,
								borderColor: theme.colors.secondary,
								backgroundColor: theme.colors.background,
							},
						]}
						onPress={() => navigation.navigate("RentalMapping")}
						icon="home-search-outline"
					>
						Tìm kiếm trên bản đồ
					</Button>

					<Appbar.Action
						icon={ isFiltered ? "filter" : "filter-outline"}
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
						onPress={() => setShowFilterModal(true)}
					/>
				</>
			) : (
				<Appbar.Content title={title} />
			)}
		</Appbar.Header>
	);
}
