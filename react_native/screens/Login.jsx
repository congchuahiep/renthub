import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useNavigation, useRoute } from "@react-navigation/native";
import qs from "qs"; // Thêm thư viện qs để chuyển đổi dữ liệu
import { useContext, useState } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import {
	Button,
	HelperText,
	Surface,
	TextInput,
	useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Apis, { authApis, endpoints } from "../config/Apis";
import { MyDispatchContext } from "../config/context";
import useStyle from "../styles/useStyle";
import { Image } from "react-native";

const info = [
	{
		label: "Tên đăng nhập",
		field: "username",
		icon: "account",
		secureTextEntry: false,
	},
	{
		label: "Mật khẩu",
		field: "password",
		icon: "eye",
		secureTextEntry: true,
	},
];

const Login = () => {
	const route = useRoute();
	const navigation = useNavigation();

	// const { message } = route?.params ? route?.params : null;

	const style = useStyle();
	const theme = useTheme();

	const [user, setUser] = useState({});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const userDispatch = useContext(MyDispatchContext);

	const setState = (value, field) => {
		setUser({ ...user, [field]: value });
	};

	const validate = () => {
		let newErrors = {};
		let valid = true;

		for (let i of info) {
			if (!user[i.field] || user[i.field].trim() === "") {
				newErrors[i.field] = `Vui lòng nhập ${i.label.toLowerCase()}!`;
				valid = false;
			}
		}
		setErrors(newErrors);
		return valid;
	};

	const handleLogin = async () => {
		if (validate() === true) {
			try {
				setLoading(true);

				const requestData = qs.stringify({
					...user,
					client_id: process.env.EXPO_PUBLIC_AUTH_CLIENT_ID,
					client_secret: process.env.EXPO_PUBLIC_AUTH_CLIENT_SECRET,
					grant_type: "password",
				});

				let res = await Apis.post(endpoints["login"], requestData, {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				});

				await AsyncStorage.setItem("token", res.data.access_token);

				let u = await authApis(res.data.access_token).get(
					endpoints.currentUser
				);

				userDispatch({
					type: "login",
					payload: u.data,
				});
			} catch (ex) {
        console.log(ex);

				let newErrors = {};
				if (ex.response?.data?.error === "invalid_grant") {
					newErrors.general = "Tài khoản hoặc mật khẩu không đúng!";
				} else {
					newErrors.general =
						ex.response?.data?.error_description ||
						"Không thể kết nối đến server. Vui lòng thử lại!";
				}
				setErrors(newErrors);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<SafeAreaView style={style.container}>
			<KeyboardAvoidingView
				behavior="padding"
				keyboardVerticalOffset={0}
				style={{ flex: 1, justifyContent: "center", gap: 2 }}
			>
				<Text
					style={{
						fontSize: 24,
						fontWeight: 700,
						color: theme.colors.primary,
						textAlign: "center",
						marginBottom: 24,
					}}
				>
					Đăng nhập
				</Text>
				{route?.params?.message && (
					<View
						style={{
							backgroundColor: theme.colors.elevation.level3,
							padding: 16,
							borderRadius: 8,
							marginBottom: 16,
							borderLeftWidth: 4,
							borderLeftColor: theme.colors.primary,
						}}
					>
						<Text
							style={{
								color: theme.colors.onSurfaceVariant,
								lineHeight: 20,
							}}
							numberOfLines={4}
						>
							{route?.params?.message}
						</Text>
					</View>
				)}
				{info.map((i) => (
					<View key={i.field} style={{}}>
						<TextInput
							autoCapitalize="none"
							outlineStyle={[style.input]}
							mode="outlined"
							label={i.label}
							secureTextEntry={i.secureTextEntry}
							right={<TextInput.Icon icon={i.icon} />}
							value={user[i.field]}
							onChangeText={(t) => setState(t, i.field)}
						/>
						{errors[i.field] && (
							<HelperText type="error">{errors[i.field]}</HelperText>
						)}
					</View>
				))}

				{errors.general && (
					<HelperText type="error">{errors.general}</HelperText>
				)}

				<Button
					style={{ marginTop: 8, borderRadius: 4 }}
					contentStyle={{ height: 48 }}
					onPress={handleLogin}
					disabled={loading}
					loading={loading}
					mode="contained"
				>
					Đăng nhập
				</Button>
				<Text style={{ marginTop: 12, textAlign: "center" }}>
					Chưa có tài khoản?{" "}
					<Link
						screen="Register"
						style={{
							color: theme.colors.primary,
							textDecorationLine: "underline",
							fontWeight: 700,
						}}
					>
						Đăng ký ngay
					</Link>
				</Text>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Login;
