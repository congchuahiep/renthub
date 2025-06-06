import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Button, Card, Icon, TextInput, useTheme } from "react-native-paper";
import { default as Apis, authApis, default as axiosInstance, endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";
import { toVietNamDong } from "../utils/currency";
import { formatDate, getRelativeTime } from "../utils/datetime";

const RoomSeekingDetail = ({ route }) => {
    const theme = useTheme();
    const style = useStyle();

    const [roomSeeking, setRoomSeeking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState();
    const [repliesComment, setRepliesComment] = useState({});
    const [openReplies, setOpenReplies] = useState({});
    const [newComment, setNewComment] = useState("");
    const [newReplyComment, setNewReplyComment] = useState({});


    const { postIntanceId } = route.params;

    const loadComment = async () => {
        try {
            const res = await Apis.get(endpoints["roomseeking-comments"](postIntanceId));
            console.log(res.data);
            setComments(res.data.results);

        } catch (ex) {
            console.log(ex);
        }
    };

    const loadRepliesComment = async (commentId) => {
        try {
            const res = await Apis.get(endpoints["roomseeking-comments-replies"](postIntanceId, commentId));
            console.log("Replies for comment:", commentId, res.data);
            if (Array.isArray(res.data) && res.data.length > 0) {
                setRepliesComment(prev => ({
                    ...prev,
                    [commentId]: res.data,
                }));
            } else {
                setRepliesComment(prev => ({
                    ...prev,
                    [commentId]: [], // vẫn set mảng rỗng để tránh lỗi undefined
                }));
            }
        } catch (ex) {
            console.log(ex);
        }
    };

    const CommentPost = async () => {
        if (!newComment.trim()) return; // không gửi bình luận rỗng

        const token = await AsyncStorage.getItem("token");
        try {
            const res = await authApis(token).post(endpoints["roomseeking-comments"](postIntanceId), {
                content: newComment.trim(),
            });
            console.log("Đã gửi bình luận:", res.data);
            setNewComment("");
        } catch (ex) {
            console.log("Lỗi gửi bình luận:", ex);
        } finally {
            loadComment();
        }
    };

    const CommentReply = async (commentId, replyContent) => {
        const token = await AsyncStorage.getItem("token");
        console.log('commentId:', commentId);

        try {
            const res = await authApis(token).post(endpoints["roomseeking-comments"](postIntanceId), {
                content: replyContent.trim(),
                reply_to: commentId,
            });
            console.log(res.data);
        } catch (ex) {
            console.log(ex);
        } finally {
            loadRepliesComment(commentId);
        }
    };



    const loadRoomSeekingPost = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(endpoints.roomseekingsDetails(postIntanceId));
            console.log(res.data);
            setRoomSeeking(res.data);
            console.log(roomSeeking);

        } catch (ex) {
            console.log(ex);

        } finally {
            setLoading(false);
        };
        loadComment();
    }
    useEffect(() => {
        console.log(postIntanceId)
        loadRoomSeekingPost();
    }, []);




    return (

        <ScrollView style={[style.container ]}>
            {roomSeeking ? (
                <>
                    {/* Tiêu đề và nội dung */}
                    <Card style={style.card}>
                        {/* <Card.Title
                            title={roomSeeking.title}
                            titleStyle={[style.title_big, { color: theme.colors.primary }]}
                        /> */}
                        <Card.Title
                            title="Thông tin bài đăng"
                            titleStyle={[style.title_big, { color: theme.colors.primary }]}
                        />
                        <Card.Content>
                            <Text style={[style.content,{color: theme.colors.secondary}]}>{roomSeeking.content}</Text>
                        </Card.Content>
                    </Card>

                    {/* Thời gian */}
                    <Card style={style.card}>
                        <Card.Title title="Thời gian" titleStyle={style.title_small} />
                        <Card.Content>
                            <View style={{ flexDirection: "column", gap: 8 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Icon source="calendar-range" size={20} color={theme.colors.secondary} />
                                    <Text style={{ marginLeft: 6, color: theme.colors.secondary }}>
                                        Đăng tải: {getRelativeTime(roomSeeking.created_date)}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Icon source="timer-sand" size={20} color={theme.colors.secondary} />
                                    <Text style={{ marginLeft: 6, color: theme.colors.secondary }}>
                                        Hết hạn: {formatDate(roomSeeking.expired_date)}
                                    </Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>


                    {/* Khu vực */}
                    <Card style={style.card}>
                        <Card.Title title="Khu vực" titleStyle={style.title_small} />
                        <Card.Content>
                            <Text style={[style.content,{color: theme.colors.secondary}]}>
                                {roomSeeking.position}, {roomSeeking.district}, {roomSeeking.province}
                            </Text>
                        </Card.Content>
                    </Card>


                    {/* Yêu cầu */}
                    <Card style={style.card}>
                        <Card.Title title="Yêu cầu" titleStyle={style.title_small} />
                        <Card.Content>
                            <View style={{ flexDirection: "column", gap: 8 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Icon source="square-rounded-outline" size={16} color={theme.colors.primary} />
                                    <Text style={{ marginLeft: 6 ,color: theme.colors.secondary}}>Diện tích: {roomSeeking.area} m²</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center",color: theme.colors.secondary }}>
                                    <Icon source="account-group-outline" size={20} color={theme.colors.primary} />
                                    <Text style={{ marginLeft: 6 ,color: theme.colors.secondary }}>
                                        Giới hạn: {roomSeeking.limit_person} người
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Icon source="cash-multiple" size={20} color={theme.colors.primary} />
                                    <Text style={{ marginLeft: 6 ,color: theme.colors.secondary}}>
                                        Giá cả: {toVietNamDong(roomSeeking.price_min)} - {toVietNamDong(roomSeeking.price_max)}
                                    </Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                </>
            ) : (
                <Text>Đang tải dữ liệu...</Text>
            )}
            <Card style={style.card}>
                <Card.Content>
                    <Text
                        style={[
                            style.title_small,
                            { color: theme.colors.primary, marginBottom: 5 },
                        ]}
                    >
                        Bình luận
                    </Text>

                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 16,
                        }}
                    >
                        <Avatar.Text label="?" size={36} />
                        <TextInput
                            label={"Bình luận của bạn..."}
                            value={newComment}
                            onChangeText={setNewComment}
                            style={{ flexGrow: 1 }}
                            mode="outlined"
                        />
                        <Button onPress={CommentPost}>Gửi</Button>
                    </View>

                    {Array.isArray(comments) && comments.length > 0 ? (
                        comments.map((cmt) => (
                            <View
                                key={cmt.id}
                                style={{
                                    marginBottom: 12,
                                    backgroundColor: theme.colors.surface, // nền theo theme
                                    padding: 12,
                                    borderRadius: 8,
                                    shadowColor: theme.dark ? "#000" : "#ccc",
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 2,
                                    elevation: 2,
                                }}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                    <Avatar.Image size={36} source={cmt.user?.avatar ? { uri: cmt.user.avatar } : null} />
                                    <Text style={{ fontWeight: "bold", color: theme.colors.onSurface, fontSize: 16 }}>
                                        {cmt.user?.name}
                                    </Text>
                                </View>
                                <Text style={{ marginLeft: 44, color: theme.colors.onSurface, fontSize: 14, marginBottom: 6 }}>
                                    {cmt.content}
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (openReplies[cmt.id]) {
                                                setOpenReplies(prev => ({ ...prev, [cmt.id]: false }));
                                            } else {
                                                if (!repliesComment[cmt.id]) {
                                                    loadRepliesComment(cmt.id);
                                                }
                                                setOpenReplies(prev => ({ ...prev, [cmt.id]: true }));
                                            }
                                        }}
                                    >
                                        <Text style={{ color: theme.colors.primary, fontWeight: "600", padding: 10 }}>
                                            {openReplies[cmt.id] ? 'Ẩn phản hồi' : 'Xem phản hồi'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            setNewReplyComment(prev => {
                                                const isOpen = prev[cmt.id] !== undefined;
                                                if (isOpen) {
                                                    const updated = { ...prev };
                                                    delete updated[cmt.id]; // Ẩn ô phản hồi
                                                    return updated;
                                                } else {
                                                    return { ...prev, [cmt.id]: "" }; // Mở ô phản hồi trống
                                                }
                                            });
                                        }}
                                    >
                                        <Text style={{ color: theme.colors.primary, fontWeight: "600", padding: 10 }}>
                                            {newReplyComment[cmt.id] !== undefined ? "Hủy" : "Trả lời"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {openReplies[cmt.id] && (
                                    <View style={{ marginLeft: 20, marginTop: 8 }}>
                                        {repliesComment[cmt.id] && repliesComment[cmt.id].length > 0 ? (
                                            repliesComment[cmt.id].map((reply) => (
                                                <View key={reply.id} style={{ marginBottom: 8 }}>
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                                        <Avatar.Image
                                                            size={36}
                                                            source={reply.user?.avatar ? { uri: reply.user.avatar } : null}
                                                        />
                                                        <Text style={{ fontWeight: "bold", color: theme.colors.onSurface }}>
                                                            {reply.user.name}
                                                        </Text>
                                                    </View>
                                                    <Text style={{ marginLeft: 44, color: theme.colors.onSurface }}>
                                                        {reply.content}
                                                    </Text>
                                                </View>
                                            ))
                                        ) : (
                                            <Text style={{ marginLeft: 4, fontStyle: "italic", color: theme.colors.onSurface }}>
                                                Không có phản hồi
                                            </Text>
                                        )}
                                        {newReplyComment[cmt.id] !== undefined && (
                                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                                <TextInput
                                                    mode="outlined"
                                                    placeholder="Nhập phản hồi..."
                                                    style={{ flex: 1 }}
                                                    value={newReplyComment[cmt.id]}
                                                    onChangeText={(text) =>
                                                        setNewReplyComment((prev) => ({ ...prev, [cmt.id]: text }))
                                                    }
                                                />
                                                <Button onPress={() => {
                                                    CommentReply(cmt.id, newReplyComment[cmt.id]);
                                                    setNewReplyComment(prev => ({ ...prev, [cmt.id]: "" }));
                                                }}>
                                                    Gửi
                                                </Button>
                                            </View>
                                        )}
                                    </View>
                                )}

                            </View>
                        ))
                    ) : (
                        <Text>Không có bình luận nào</Text>
                    )}

                </Card.Content>
            </Card>
        </ScrollView>


    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
    content: { marginBottom: 12, fontSize: 16 },
    section: { marginVertical: 10 },
});

export default RoomSeekingDetail;