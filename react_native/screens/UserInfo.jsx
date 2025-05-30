import { StyleSheet, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import useStyle from "../styles/useStyle";

const UserInfo = ({route})=>{
    const theme = useTheme();
    const style = useStyle();

    const{user}= route.params;

    return (
        <SafeAreaView style={style.container}>
            <View>
                <Avatar.Image
                    size={96}
                    source={user?.avatar?{uri:user.avatar}:null}
                />
                <Text style={styles.title}>Thông tin cá nhân</Text>
                <Text style={styles.info}>Họ và tên: {user.first_name} {user.last_name}</Text>
                <Text style={styles.info}>Email: {user.email}</Text>
                <Text style={styles.info}>Số điện thoại: {user.phone || "Chưa cập nhật"}</Text>
                <Text style={styles.info}>Địa chỉ: {user.address || "Chưa cập nhật"}</Text>
            </View>
        </SafeAreaView>
    );
    
};

const styles = StyleSheet.create({
    
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    info: {
        fontSize: 18,
        marginBottom: 8,
    },
});
export default UserInfo;