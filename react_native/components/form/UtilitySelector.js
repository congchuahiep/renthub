import { View, FlatList, Dimensions } from "react-native";
import { Card, Text, IconButton, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const UtilitySelector = ({
	utilities,
	selectedIds,
	onToggle,
	error,
	height = 240,
}) => {
	const theme = useTheme();
	const renderUtility = ({ item }) => {
		const isSelected = selectedIds.includes(item.id);

		return (
			<Card
				style={{
					margin: 4,
					backgroundColor: isSelected
						? theme.colors.primary
						: theme.colors.elevation.level1,
					width: "30%",
					aspectRatio: 1,
				}}
				onPress={() => onToggle(item.id)}
			>
				<Card.Content
					style={{ alignItems: "center", justifyContent: "center" }}
				>
					<MaterialCommunityIcons
						name={item.icon}
						size={32}
						color={
							isSelected
								? theme.colors.onPrimary
								: theme.colors.outline
						}
					/>
					<Text
						style={{
							textAlign: "center",
							marginTop: 8,
              fontSize: 11,
							color: isSelected
								? theme.colors.onPrimary
								: theme.colors.outline,
						}}
						numberOfLines={2}
					>
						{item.name}
					</Text>
				</Card.Content>
			</Card>
		);
	};

	return (
		<View style={{ height: height }}>
			<FlatList
				data={utilities}
				renderItem={renderUtility}
				numColumns={3}
				keyExtractor={(item) => item.id.toString()}
				showsVerticalScrollIndicator={true}
			/>

			{error && (
				<Text style={{ color: theme.colors.error, marginTop: 8 }}>{error}</Text>
			)}
		</View>
	);
};

export default UtilitySelector;
