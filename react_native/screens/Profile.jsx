import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { authApis, endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";

const Profile = () => {
  const theme = useTheme();
  const style = useStyle();
  const [loading, setLoading]=useState(false);
  const [user, setUser]= useState(null);


  const profile = async()=>{
    const token = await AsyncStorage.getItem('token');
    try {
      setLoading(true);
      let response = await authApis(token).get(endpoints["current-user"]);
      console.log("Thông tin người dùng", response.data);
      setUser(response.data);
    } catch(ex){
      console.error(ex)
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    profile();
  }, []);

  return (
    <SafeAreaView style={style.container}>
      {loading ? (
        <Text>Đang tải...</Text>
      ) : user ? (
        <View>
          <Text>Tên đăng nhập: {user.username}</Text>
          <Text>Họ tên: {user.first_name} {user.last_name}</Text>
          <Text>Email: {user.email}</Text>
        </View>
      ) : (
        <Text>Không có thông tin người dùng.</Text>
      )}
    </SafeAreaView>
  );
}

export default Profile;