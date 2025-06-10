import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, View } from "react-native";
import { Avatar, Button, List, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { createOrGetChat } from "../components/ChatCreate";
import axiosInstance, { authApis, endpoints } from "../config/Apis";
import { useAuth } from "../config/auth";
import useStyle from "../styles/useStyle";

const ProfileUser = ({ route }) => {
  const theme = useTheme();
  const style = useStyle();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { user: currentUser } = useAuth();
  const navigation = useNavigation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;


  const loadUser = async () => {
    const { userId } = route.params;
    try {
      setLoading(true);
      const response = await axiosInstance.get(endpoints.user(userId));
      setUser(response.data);
    } catch (ex) {
      console.error("Lỗi khi lấy thông tin người dùng:", ex);
    } finally {
      setLoading(false);
    }
  };
  const handleFollow = async () => {
    runSpinAnimation();
    const token = await AsyncStorage.getItem('token');
    setFollowLoading(true);

    try {
      if (!isFollowing) {
        await authApis(token).post(endpoints.follow(user.id));
        setIsFollowing(true);
      } else {
        Alert.alert(
          "Xác nhận",
          "Bạn có muốn hủy theo dõi?",
          [
            { text: "Hủy", style: "cancel", onPress: () => setFollowLoading(false) },
            {
              text: "Có",
              onPress: async () => {
                try {
                  await authApis(token).delete(endpoints["follow-delete"](user.id));
                  setIsFollowing(false);
                } catch (err) {
                  alert("Không thể hủy theo dõi.");
                } finally {
                  setFollowLoading(false);
                }
              },
            },
          ]
        );
        return;
      }
    } catch (err) {
      alert("Không thể thay đổi trạng thái.");
    } finally {
      if (!isFollowing) setFollowLoading(false);
    }
  };

  const runSpinAnimation = () => {
    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 200, // 0.2s
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleChatCreation = async () => {
    const chatId = await createOrGetChat(currentUser, user);
    console.log('Chat ID:', currentUser.id);
    console.log('Navigation:', navigation);
    navigation.navigate('ChatScreen',  { chatId, userId: currentUser.id });
  };


  useEffect(() => {
    console.log();
    loadUser();
  }, []);

  useEffect(() => {
    const checkFollowStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await authApis(token).get(endpoints["is-follow"](user.id));
        setIsFollowing(response.data.is_following); // Cập nhật trạng thái từ API
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái theo dõi:", err);
      }
    };

    if (user) {
      checkFollowStatus();
    }
  }, [user]);

  {
    user?.user_type === "landlord" && (
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
    )
  }
  {
    user?.user_type === "tenant" && (
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
    )
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
            onPress={() => navigation.navigate("FollowerList", { userId: user.id, userType: user.user_type })}
          >
            Số người theo dõi: {user.follow_count || 0}
          </Button>

        )}
        {user?.user_type === "tenant" && (
          <Button
            mode="contained"
            style={{ marginTop: 8 }}
            onPress={() => navigation.navigate("FollowerList", { userId: user.id, userType: user.user_type })}
          >
            Số người đang theo dõi: {user.follow_count || 0}
          </Button>
        )}

        {currentUser?.user_type === "tenant" && user?.user_type === "landlord" && (
          <Button
            mode={isFollowing ? "contained" : "outlined"}
            style={{ marginTop: 8, flexDirection: "row", alignItems: "center" }}
            buttonColor={isFollowing ? "green" : undefined}
            onPress={handleFollow}
            disabled={followLoading}
            icon={() =>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Avatar.Icon size={20} icon={isFollowing ? "check" : "plus"} />
              </Animated.View>
            }
          >
            {isFollowing ? "Đã theo dõi" : "Theo dõi"}
          </Button>

        )}
        
        {currentUser?.id !== user?.id && (

          <Button
            mode="contained"
            style={{ marginTop: 8 }}
            onPress={handleChatCreation}
          >
            Trò chuyện
          </Button>
        )}


      </View>
      <View style={{ flex: 1 }}>
        <List.Section style={style.card}>
          <List.Item
            title="Thông tin cá nhân"
            left={props => <List.Icon {...props} icon="account" />}
            onPress={() => navigation.navigate("ProfileDetail", { userData: user })}
          />
          <List.Item
            title="Bài đăng"
            left={props => <List.Icon {...props} icon="post" />}
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
