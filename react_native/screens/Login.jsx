import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import qs from 'qs'; // Thêm thư viện qs để chuyển đổi dữ liệu
import { useContext, useState } from "react";
import { ScrollView } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
// import { MyDispatchContext } from "../../configs/context";
import Apis, { authApis, endpoints } from "../config/Apis";
import { MyDispatchContext } from "../config/context";


const Login = () => {
    const info = [{
        label: 'Tên đang nhập',
        field: 'username',
        icon: 'account',
        secureTextEntry: false
    }, {
        label: 'Mật khẩu',
        field: 'password',
        icon: 'eye',
        secureTextEntry: true
    }];
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState();
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext);

    const setState = (value, field) => {
        setUser({ ...user, [field]: value })
    }
    const validate = () => {
        if (Object.values(user).length == 0) {
            setMsg("Vui lòng nhập thông tin!");
            return false;
        }
        for (let i of info)
            if (user[i.field] === '') {
                setMsg(`Vui lòng nhập ${i.label}!`);
                return false;
            }
        setMsg('');
        return true;
    }

    const login = async () => {
        if (validate() === true) {
            try {
                setLoading(true);

                const requestData = qs.stringify({
                    ...user,
                    client_id: 'hpnqqelKAPairSkG8oYV49ypdMiGAbiLTch3h1Ui',
                    client_secret: 'CIfvykKzUzlWIUZ0JvUBEL16FS5IOi2CKTCtAyptXRvd8VzqsRPcxo3DNmPNuk7ZYrsSK1lH76fdJHg4OOkjq7XQLIRjRvqYQQL7lWr8UbLFcu3CVhqicvg7u7ErHcC8',
                    grant_type: 'password'
                });
                console.log("Request data:", requestData);

                let res = await Apis.post(endpoints['login'], requestData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                console.log("Login response:", res.data);

                await AsyncStorage.setItem('token', res.data.access_token);

                let u = await authApis(res.data.access_token).get(endpoints['current-user']);
                dispatch({
                    type: "login",
                    payload: u.data
                });
            } catch (ex) {
                console.error("Login Error:", ex.response?.data || ex.message);

                if (ex.response?.data?.error === "invalid_grant") {
                    setMsg("Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập hoặc mật khẩu!");
                } else {
                    setMsg(ex.response?.data?.error_description || "Không thể kết nối đến server. Vui lòng thử lại!");
                }
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <ScrollView>
            <HelperText type="error" visible={msg}>
                {msg}
            </HelperText>
            {info.map(i => <TextInput key={i.field} 
                label={i.label}
                secureTextEntry={i.secureTextEntry}
                right={<TextInput.Icon icon={i.icon} />}
                value={user[i.field]} onChangeText={t => setState(t, i.field)} />)}
            <Button onPress={login} disabled={loading} loading={loading}  mode="contained">Đăng nhập</Button>
        </ScrollView>
    )
}

export default Login;