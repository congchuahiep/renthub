import { View, StyleSheet } from "react-native";
import { Button, Divider, Text, useTheme } from "react-native-paper";

const StepBottomBar = ({
	step,
	steps, // [{title: "Thông tin căn bản"}, ...]
	onBack,
	onNext,
	onSkip,
	onFinish,
	loading,
	showSkip = false,
	style,
}) => {
	const theme = useTheme();
	const isFirst = step === 1;
	const isLast = step === steps.length;

	return (
		<View
			style={[
				{
					paddingVertical: 12,
					borderTopWidth: 1,
					borderColor: theme.colors.secondary,
					backgroundColor: theme.colors.onSecondary,
					alignItems: "center",
				},
				style,
			]}
		>
			<View style={{ flexDirection: "row", marginBottom: 42 }}>
				{steps.map((s, idx) => (
					<View
						key={idx}
						style={[
							{
								// width: 28,
								height: 28,
								minWidth: 28,
								borderRadius: 14,
								marginHorizontal: 4,
								paddingHorizontal: 8,
								alignItems: "center",
								justifyContent: "center",
								backgroundColor:
									idx + 1 === step
										? theme.colors.secondary
										: idx + 1 > step
										? theme.colors.background
										: theme.colors.surfaceVariant,
								borderWidth: 1,
								borderColor: theme.colors.secondary,
							},
						]}
					>
						<Text style={idx + 1 === step ? styles.activeText : styles.text}>
							{idx + 1}
							{idx + 1 === step && "  - " + steps[step - 1]?.title}
						</Text>
					</View>
				))}
			</View>

			<View
				style={{
					width: "100%",
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: 12,
					gap: 8,
				}}
			>
				{/* Bên trái: nút Quay lại */}
				<View style={{ flexDirection: "row" }}>
					{!isFirst && (
						<Button mode="outlined" onPress={onBack} style={styles.button}>
							Quay lại
						</Button>
					)}
				</View>
				{/* Bên phải: các nút còn lại */}
				<View style={{ flexDirection: "row" }}>
					{showSkip && !isLast && (
						<Button mode="text" onPress={onSkip} style={styles.button}>
							Bỏ qua
						</Button>
					)}
					{!isLast ? (
						<Button mode="contained" onPress={onNext} style={styles.button}>
							Tiếp theo
						</Button>
					) : (
						<Button
							mode="contained"
							onPress={onFinish}
							loading={loading}
							disabled={loading}
							style={styles.button}
						>
							Hoàn tất
						</Button>
					)}
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 12,
		borderTopWidth: 1,
		borderColor: "#eee",
		backgroundColor: "#fff",
		alignItems: "center",
	},
	indicatorWrapper: {
		flexDirection: "row",
		marginBottom: 8,
	},
	circle: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "#eee",
		marginHorizontal: 4,
		alignItems: "center",
		justifyContent: "center",
	},
	activeCircle: {
		backgroundColor: "#1976d2",
	},
	text: {
		color: "#888",
		fontWeight: "bold",
	},
	activeText: {
		color: "#fff",
		fontWeight: "bold",
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
		color: "#222",
		textAlign: "center",
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 8,
	},
	button: {
		marginHorizontal: 4,
		minWidth: 100,
	},
});

export default StepBottomBar;
