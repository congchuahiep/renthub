import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { authApis, endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";

const FollowerList = ({ route }) => {
    const { userId, userType } = route.params; // Nhận userId và userType từ route.params
    const style = useStyle();
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(false);
     const navigation = useNavigation();
    const loadFollowerList = async () => {
        const token = await AsyncStorage.getItem("token");
        try {
            setLoading(true);
            let response = await authApis(token).get(endpoints.follow(userId));
            // console.log("Danh sách người theo dõi", response.data);

            if (response.data) {
                // Nếu người dùng là tenant, lấy danh sách followee
                if (userType === "tenant") {
                    const followees = response.data.map((item) => item.followee);
                    setFollowers(followees);
                }
                // Nếu người dùng là landlord, lấy danh sách follower
                else if (userType === "landlord") {
                    const followers = response.data.map((item) => item.follower);
                    setFollowers(followers);
                }
            } else {
                console.error("API trả về dữ liệu không hợp lệ");
            }

        } catch (ex) {
            console.error("Lỗi khi gọi API:", ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFollowerList();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : followers.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                    Không có người theo dõi nào.
                </Text>
            ) : (
                <FlatList
                    data={followers}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ProfileUser", { userId: item.id })}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    padding: 10,
                                    marginBottom: 10,
                                    backgroundColor: "#fff",
                                    borderRadius: 8,
                                    shadowColor: "#000",
                                    shadowOpacity: 0.1,
                                    shadowRadius: 5,
                                    elevation: 3,
                                }}
                            >
                                <Avatar.Image
                                    size={48}
                                    source={item.avatar ? { uri: item.avatar } : null}
                                />
                                <View style={{ marginLeft: 16 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                                        Tên: {item.name}
                                    </Text>
                                    <Text>Email: {item.email}</Text>
                                    <Text>Đến từ: {item.province}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    )

};

export default FollowerList;