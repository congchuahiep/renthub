import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

const Counter = ({ label, icon, value, onChange, min = 0, max = Infinity }) => {
	const theme = useTheme();

	const increase = () => {
		if (value < max) {
			onChange(value + 1);
		}
	};

	const decrease = () => {
		if (value > min) {
			onChange(value - 1);
		}
	};

	return (
		<View
			style={{
				alignItems: "center",
				paddingVertical: 8,
				flexDirection: "row",
				justifyContent: "space-between",
			}}
		>
			<View
				style={{ flexDirection: "row", alignItems: "center", marginBottom: 0 }}
			>
				<IconButton icon={icon} size={20} />
				<Text>{label}</Text>
			</View>

			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<IconButton
					size={16}
					icon="minus"
					onPress={decrease}
					disabled={value <= min}
					mode="contained"
				/>
				<Text style={{ fontSize: 20, marginHorizontal: 8 }}>{value}</Text>
				<IconButton
					size={16}
					icon="plus"
					onPress={increase}
					disabled={value >= max}
					mode="contained"
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		paddingVertical: 8,
	},
	labelContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	label: {
		fontSize: 16,
	},
	counterRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	value: {
		fontSize: 20,
		marginHorizontal: 16,
	},
});

export default Counter;
