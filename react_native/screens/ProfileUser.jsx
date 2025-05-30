import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Avatar, Button, List, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance, { authApis, endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";

const ProfileUser = ({ route }) => {
	const theme = useTheme();
	const style = useStyle();
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);
	const navigation = useNavigation();
	const [isFollowing, setIsFollowing] = useState(false);

	const checkFollowStatus = async () => {
		const token = await AsyncStorage.getItem("token");
		const currentUserId = await AsyncStorage.getItem("user_id");

		try {
			const res = await authApis(token).get(endpoints["is-follow"](user.id));
			console.log(res.data);
			if (res.data.is_following == true) {
				setIsFollowing(true);
			}
			console.log(isFollowing);
		} catch (error) {
			if (error.response?.status === 404) {
				setIsFollowing(false);
			} else {
				console.error("Lỗi kiểm tra follow:", error);
			}
		}
	};

	const loadCurrentUser = async () => {
		const token = await AsyncStorage.getItem("token");
		try {
			const res = await authApis(token).get(endpoints["current-user"]);
			setCurrentUser(res.data);
		} catch (err) {
			console.error("Lỗi khi lấy currentUser:", err);
		}
	};

	const loadUser = async () => {
		const { userId } = route.params;
		try {
			setLoading(true);
			const response = await axiosInstance.get(endpoints.user(userId));
			console.log("Thông tin người dùng:", response.data);
			setUser(response.data);
		} catch (ex) {
			console.error("Lỗi khi lấy thông tin người dùng:", ex);
		} finally {
			setLoading(false);
		}
	};
	const handleFollow = async () => {
		const token = await AsyncStorage.getItem("token");
		try {
			if (isFollowing != true) {
				const res = await authApis(token).post(endpoints.follow(user.id));
				alert("Đã theo dõi người dùng!");
			} else {
				alert("Đã theo dõi người dùng!");
			}
		} catch (err) {
			console.error("Lỗi khi theo dõi:", err);
			alert("Không thể theo dõi.");
		}
	};

	useEffect(() => {
		loadCurrentUser();
		loadUser();
	}, []);

	useEffect(() => {
		if (user && currentUser) {
			checkFollowStatus();
		}
	}, [user, currentUser]);

	if (loading) {
		return (
			<SafeAreaView
				style={[
					style.container,
					{ flex: 1, justifyContent: "center", alignItems: "center" },
				]}
			>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={[style.container, { flex: 1 }]}>
			<View style={{ alignItems: "center", marginTop: 32, marginBottom: 16 }}>
				<Avatar.Image
					size={96}
					source={user?.avatar ? { uri: user.avatar } : null}
				/>
				<Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 12 }}>
					{user ? `${user.first_name} ${user.last_name}` : ""}
				</Text>
				<Text style={{ color: theme.colors.secondary, marginTop: 2 }}>
					{user?.email}
				</Text>

				{user?.user_type === "landlord" && (
					<Button
						mode="contained"
						style={{ marginTop: 8 }}
						onPress={() =>
							navigation.navigate("FollowerList", {
								userId: user.id,
								userType: user.user_type,
							})
						}
					>
						Số người theo dõi: {user.follow_count || 0}
					</Button>
				)}
				{user?.user_type === "tenant" && (
					<Button
						mode="contained"
						style={{ marginTop: 8 }}
						onPress={() =>
							navigation.navigate("FollowerList", {
								userId: user.id,
								userType: user.user_type,
							})
						}
					>
						Số người đang theo dõi: {user.follow_count || 0}
					</Button>
				)}

				{user &&
					currentUser &&
					currentUser.user_type === "tenant" &&
					user.user_type === "landlord" &&
					currentUser.id !== user.id && (
						<Button
							mode={isFollowing ? "contained" : "outlined"}
							style={{ marginTop: 8 }}
							buttonColor={isFollowing ? "green" : undefined}
							onPress={handleFollow}
						>
							{isFollowing ? "Đã theo dõi" : "Theo dõi"}
						</Button>
					)}
			</View>
			<View style={{ flex: 1 }}>
				<List.Section style={style.card}>
					<List.Item
						title="Thông tin cá nhân"
						left={(props) => <List.Icon {...props} icon="account" />}
						onPress={() => navigation.navigate("UserInfo", { user })}
					/>
					<List.Item
						title="Bài đăng"
						left={(props) => <List.Icon {...props} icon="post" />}
						onPress={() => {
							if (user) {
								navigation.navigate("detailInfo", { user });
							} else {
								alert("Người dùng không tồn tại!");
							}
						}}
					/>
				</List.Section>
			</View>
		</SafeAreaView>
	);
};

export default ProfileUser;
