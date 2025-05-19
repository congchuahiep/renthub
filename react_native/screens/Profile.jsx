import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Avatar, List, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { authApis, endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";
import { MyDispatchContext } from "../config/context";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const theme = useTheme();
  const style = useStyle();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const userDispatch = useContext(MyDispatchContext);

  const profile = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      setLoading(true);
      let response = await authApis(token).get(endpoints["current-user"]);
      console.log("Thông tin người dùng", response.data);
      setUser(response.data);
    } catch (ex) {
      console.error(ex)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    profile();
  }, []);

  const handleLogout = async () => {
    userDispatch({ type: "logout" })
  };

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
      </View>

      <View style={{ flex: 1 }}>
        <List.Section style={style.card}>
          <List.Item
            title="Thông tin cá nhân"
            left={props => <List.Icon {...props} icon="account" />}
            onPress={() => navigation.navigate("userInfo")}
          />
          <List.Item
            title="Bài đăng của tôi"
            left={props => <List.Icon {...props} icon="post" />}
            onPress={() => navigation.navigate("myPosts")}
          />
        </List.Section>
        <List.Section style={style.card}>
          <List.Item
            title="Cài đặt"
            left={props => <List.Icon {...props} icon="cog" />}
            onPress={() => navigation.navigate("settings")}
          />
          <List.Item
            title="Đổi mật khẩu"
            left={props => <List.Icon {...props} icon="lock-reset" />}
            onPress={() => navigation.navigate("changePassword")}
          />
          <List.Item
            title="Đăng xuất"
            left={props => <List.Icon {...props} icon="logout" />}
            onPress={handleLogout}
          />
        </List.Section>
      </View>
    </SafeAreaView>
  );
}

export default Profile;