import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance, { endpoints } from "../config/Apis";
import { ThemeSettingContext } from "../config/context";
import useStyle from "../styles/useStyle";




const Users = () => {
    const { themeMode } = useContext(ThemeSettingContext);
    const theme = useTheme();
    const style = useStyle();
    const [user, setUser] = useState([]);
    const navigation = useNavigation();
    const userTypeMapping = {
        admin: "Quản trị viên",
        landlord: "Chủ nhà",
        tenant: "Người thuê",
    };

    const loadUserList = async () => {
        try {
            const response = await axiosInstance.get(endpoints.users, {

            });

            setUser(response.data.results || response.data);
        } catch (error) {
            console.error("Error fetching rentals:", error);
        }
    };
    useEffect(() => {
        console.log("Fetching user...");

        loadUserList();
    }, []);
    return (

        // style={{ flex: 1, padding: 16 }}
        <SafeAreaView style={style.container}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
                Những người bạn có thể biết
            </Text>
            <FlatList
                data={user}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ProfileUser", { userId: item.id })}
                    >
                        <View style={[style.card, { padding: 15 }]}>
                        

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Avatar.Image
                                    size={64}
                                    source={item.avatar ? { uri: item.avatar } : null}
                                />
                                <View style={{ marginLeft: 16, flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                                        {item.first_name} {item.last_name}
                                    </Text>
                                    <Text>{item.email}</Text>
                                    <Text>
                                        Người dùng: {userTypeMapping[item.user_type] || "Không xác định"}
                                    </Text>
                                    <Text>
                                        Đến từ: {item.province || "Chưa cập nhật"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>

    )

};

// const styles = StyleSheet.create({

//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: "#f9f9f9",
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         marginBottom: 16,
//     },
//     row: {
//         flexDirection: "row", // Sắp xếp theo hàng ngang
//         alignItems: "center", // Căn giữa theo trục dọc
//     },
//     info: {
//         marginLeft: 16, // Khoảng cách giữa avatar và thông tin
//         flex: 1, // Để thông tin chiếm phần còn lại của hàng
//     },
//     itemTitle: {
//         fontSize: 18,
//         fontWeight: "bold",
//     },
// });
export default Users;