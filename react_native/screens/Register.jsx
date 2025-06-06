import { View, Image } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useStyle from "../styles/useStyle";

const Register = ({ navigation }) => {
	const style = useStyle();
	const theme = useTheme();

	return (
		<View
			style={[
				style.container,
				{
					justifyContent: "center",
					alignItems: "center",
					padding: 20,
				},
			]}
		>
			<Text
				style={{
					fontSize: 28,
					fontWeight: "bold",
					marginBottom: 32,
					textAlign: "center",
				}}
			>
				Đăng ký tài khoản
			</Text>
			<Button
				mode="contained"
				style={{
					marginBottom: 16,
					width: 280,
					borderRadius: 10,
					elevation: 4,
				}}
				contentStyle={{ paddingVertical: 8 }}
				onPress={() => navigation.navigate("RegisterTenant")}
				icon={({ size, color }) => (
					<MaterialCommunityIcons
						name="account-circle"
						size={24}
						color={color}
					/>
				)}
			>
				Đăng ký thuê trọ
			</Button>
			<Button
				mode="contained"
				style={{
					backgroundColor: theme.colors.secondary,
					marginBottom: 16,
					width: 280,
					borderRadius: 10,
					elevation: 4,
				}}
				contentStyle={{ paddingVertical: 8 }}
				onPress={() => navigation.navigate("RegisterLandlord")}
				icon={({ size, color }) => (
					<MaterialCommunityIcons name="home-account" size={24} color={color} />
				)}
			>
				Đăng ký chủ trọ
			</Button>
			<Button
				mode="outlined"
				style={{
					width: 280,
					borderRadius: 10,
					borderWidth: 2,
				}}
				contentStyle={{ paddingVertical: 8 }}
				onPress={() => navigation.goBack()}
				icon={({ size, color }) => (
					<MaterialCommunityIcons
						name="keyboard-backspace"
						size={24}
						color={color}
					/>
				)}
			>
				Quay lại
			</Button>
		</View>
	);
};

export default Register;
