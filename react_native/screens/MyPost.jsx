import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Avatar, IconButton, Menu, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { authApis, endpoints } from "../config/Apis";
import { useAuth } from "../config/auth";
import useStyle from "../styles/useStyle";

const MyPost = () => {
    const style = useStyle();
    const theme = useTheme();
    const [myPost, setMyPost] = useState([]);
    const navigation = useNavigation();
    const { user } = useAuth();
    const [visibleMenu, setVisibleMenu] = useState(null);

    const statusTypeMapping = {
		active: "Đã kiểm duyệt",
		rejected: "Từ chối kiểm duyệt",
		expired: "Hết hạn",
		rented: "Đã thuê",
	};

    const toRentalDetail = (id, title) => {
        navigation.navigate("RentalDetail", { id, title });
    };
    const loadPost = async () => {

        const token = await AsyncStorage.getItem("token");
        if (user.user_type === 'landlord') {
            let response = await authApis(token).get(endpoints.my_rental_post);
            console.log(response.data);
            setMyPost(response.data);
        } else {
            let response = await authApis(token).get(endpoints.my_room_seeking_post);
            console.log(response.data);
            setMyPost(response.data);
        }

    }

    const updatePostStatus = async (postId, newStatus) => {
        const token = await AsyncStorage.getItem("token");
        try {
            const endpoint =
                user.user_type === "landlord"
                    ? endpoints.rentals_update(postId) // Endpoint cho landlord
                    : endpoints.roomseekings_update(postId); // Endpoint cho tenant
    
            await authApis(token).patch(endpoint, {
                status: newStatus,
            });
    
            console.log(`Cập nhật trạng thái bài đăng ${postId} thành ${newStatus}`);
            loadPost(); // Làm mới danh sách bài đăng sau khi cập nhật
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        }
    };

    useEffect(() => {
        loadPost();
    }, [])

    return (
        <SafeAreaView style={{ position: "relative", flex: 1 }}>
            <FlatList
                style={style.container}
                data={myPost}
                keyExtractor={(item, index) => item.post.id + "_" + index}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() =>
                            user.user_type === "tenant"
                                ? navigation.navigate("RoomSeekingDetail", {
                                      postIntanceId: item?.post?.id,
                                  })
                                : toRentalDetail(item?.post?.id, item?.title)
                        }
                    >
                        <View style={[style.card, { padding: 15 }]}>
                            {/* Avatar và thông tin chủ sở hữu */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between", // Thêm khoảng cách giữa avatar và menu
                                    marginBottom: 8,
                                }}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Avatar.Image
                                        source={item.owner?.avatar ? { uri: item.owner.avatar } : null}
                                        style={{ borderRadius: 18, marginRight: 8 }}
                                        size={32}
                                    />
                                    <View>
                                        <Text
                                            style={{
                                                color: theme.colors.onSurface,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {item.owner?.name || "Không xác định"}
                                        </Text>
                                        <Text style={{ color: theme.colors.onSurface, fontSize: 12 }}>
                                            {moment(item.created_date).format("DD/MM/YYYY")}
                                        </Text>
                                    </View>
                                </View>

                                {/* Nút menu */}
                                <Menu
                                    visible={visibleMenu === item.post.id}
                                    onDismiss={() => setVisibleMenu(null)}
                                    anchor={
                                        <IconButton
                                            icon="dots-vertical"
                                            size={24}
                                            onPress={() => setVisibleMenu(item.post.id)}
                                        />
                                    }
                                >
                                    
                                    <Menu.Item
                                        onPress={() => {
                                            updatePostStatus(item.post.id, "expired");
                                            setVisibleMenu(null);
                                        }}
                                        title="Cập nhật trạng thái: Hết hạn"
                                    />
                                    <Menu.Item
                                        onPress={() => {
                                            updatePostStatus(item.post.id, "rejected");
                                            setVisibleMenu(null);
                                        }}
                                        title="Cập nhật trạng thái: Từ chối"
                                    />
                                </Menu>
                            </View>

                            {/* Thông tin bài đăng */}
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    fontSize: 18,
                                    marginBottom: 8,
                                    color: theme.colors.onSurface,
                                }}
                            >
                                {item.title || "Không có tiêu đề"}
                            </Text>
                            <Text style={{ color: theme.colors.onSurface }}>
                                Khu vực: {item.position || "Chưa cập nhật"}
                            </Text>
                            <Text style={{ color: theme.colors.onSurface }}>
                                Diện tích: {item.area} m²
                            </Text>
                            <Text style={{ color: theme.colors.onSurface }}>
                                Giới hạn: {item.limit_person} người
                            </Text>
                            <Text style={{ color: theme.colors.onSurface }}>
                                Trạng thái: {statusTypeMapping[item.status] || "Không xác định"}
                            </Text>
                            <Text style={{ color: theme.colors.onSurface }}>
                                Hết hạn:{" "}
                                {item.expired_date
                                    ? moment(item.expired_date).format("DD/MM/YYYY")
                                    : "Không rõ"}
                            </Text>
                        </View>
                        </TouchableOpacity>
                    );

                }}

            />
        </SafeAreaView>
    );
};
    
export default MyPost;