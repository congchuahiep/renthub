import moment from "moment";
import { useEffect, useState } from "react";
import {
    FlatList,
    RefreshControl,
    Text,
    View
} from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";

const RoomSeekingList = () => {
    // const { themeMode } = useContext(ThemeSettingContext);
    const theme = useTheme();
    const style = useStyle();
    const [roomSeekings, setRoomSeeking] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const statusTypeMapping = {
        approved: "Đã kiểm duyệt",
        pending: "Đang kiểm duyệt",
        rejected: "Từ chối kiểm duyệt",
        expired: "Hết hạn",
        rented: "Đã thuê",
    };

    const loadRoomSeekingPosts = async () => {
        try {
            const res = await Apis.get(endpoints.roomseekings);
            setRoomSeeking(res.data.results); // Nếu dùng pagination
        } catch (ex) {
            console.error(ex);
        }
    };

    useEffect(() => {
        loadRoomSeekingPosts();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadRoomSeekingPosts().finally(() => setRefreshing(false));
    };

    const renderItem = ({ item }) => {
        // const textColor = themeMode === "dark" ? theme.colors.elevation.level1 : theme.colors.surface;

        return (
            <View style={[style.card, { padding: 15 }]}>
                {/* Header */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                    <Avatar.Image
                        source={
                            item.owner.avatar
                                ? { uri: item.owner.avatar } : null

                        }
                        style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8 }}
                    />
                    <View>
                        <Text style={{ fontWeight: "bold" }}>{item.owner.name}</Text>
                        <Text style={{ color: "gray", fontSize: 12 }}>
                            {moment(item.created_date).format("DD [tháng] MM [lúc] HH:mm")}
                        </Text>
                    </View>
                </View>
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        marginBottom: 8,
                    }}
                >
                    {item.title}
                </Text>
                <Text>Khu vực: {item.position|| "Chưa cập nhật"}</Text>
                <Text >Diện tích: {item.area} m²</Text>
                <Text >Giới hạn: {item.limit_person} người</Text>
                <Text >Trạng thái: {statusTypeMapping[item.status] || "Không xác định"}</Text>
                <Text >
                    Hết hạn: {moment(item.expired_date).format("DD/MM/YYYY")}
                </Text>
            </View>
        );
    };



    return (
        <SafeAreaView style={style.container}>
            <FlatList
                data={roomSeekings}
                keyExtractor={(item, index) => item.id + "_" + index}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                    />
                }
            />
        </SafeAreaView>
    );
};

export default RoomSeekingList;
