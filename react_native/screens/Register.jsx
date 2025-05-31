import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import useStyle from "../styles/useStyle";

const Register = ({ navigation }) => {
	const style = useStyle();

	return (
		<View
			style={[
				style.container,
				{ justifyContent: "center", alignItems: "center" },
			]}
		>
			<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 32 }}>
				Đăng ký tài khoản
			</Text>
			<Button
				mode="contained"
				style={{ marginBottom: 16, width: 220 }}
				onPress={() => navigation.navigate("RegisterTenant")}
			>
				Đăng ký thuê trọ
			</Button>
			<Button
				mode="contained"
				style={{ marginBottom: 16, width: 220 }}
				onPress={() => navigation.navigate("RegisterLandlord")}
			>
				Đăng ký chủ trọ
			</Button>
			<Button
				mode="outlined"
				style={{ width: 220 }}
				onPress={() => navigation.goBack()}
			>
				Quay lại
			</Button>
		</View>
	);
};

export default Register;
