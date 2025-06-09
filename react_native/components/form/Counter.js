import React from "react";
import { View, StyleSheet } from "react-native";
import { HelperText, IconButton, Text, useTheme } from "react-native-paper";

const Counter = ({
	label,
	icon,
	value = 0,
	onChange,
	error,
	min = 0,
	max = Infinity,
}) => {
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

	const color = error ? theme.colors.error : theme.colors.onSurface;

	return (
		<View style={{ paddingVertical: 8 }}>
			<View
				style={{
					alignItems: "center",
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 0,
					}}
				>
					<IconButton icon={icon} size={20} />
					<Text style={{ color: color}}>{label}</Text>
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
			{error && (
				<HelperText type="error" visible={!!error}>
					{error}
				</HelperText>
			)}
		</View>
	);
};

export default Counter;
