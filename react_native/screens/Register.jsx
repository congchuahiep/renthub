// import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Apis, { endpoints } from "../config/Apis";

const Register = () => {
    const [accountType, setAccountType] = useState("tenant"); // Loại tài khoản: "tenant" hoặc "landlord"
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    // Các trường thông tin cho từng loại tài khoản
    const tenantInfo = [
        { label: "Tên", field: "first_name", secureTextEntry: false, icon: "account" },
        { label: "Họ và tên lót", field: "last_name", secureTextEntry: false, icon: "account-outline" },
        { label: "Tên đăng nhập", field: "username", secureTextEntry: false, icon: "account-circle" },
        { label: "Email", field: "email", secureTextEntry: false, icon: "email" },
        { label: "Mật khẩu", field: "password", secureTextEntry: true, icon: "eye" },
        { label: "Xác nhận mật khẩu", field: "confirm", secureTextEntry: true, icon: "eye" },
    ];

    const landlordInfo = [
        ...tenantInfo,
        { label: "Số điện thoại", field: "phone", secureTextEntry: false, icon: "phone" },
    ];

    const fields = accountType === "tenant" ? tenantInfo : landlordInfo;

    const setState = (value, field) => {
        setUser({ ...user, [field]: value });
    };

    // const pick = async () => {
    //     let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    //     if (status !== 'granted') {
    //         alert("Permissions denied!");
    //     } else {
    //         const result = await ImagePicker.launchImageLibraryAsync();

    //         if (!result.canceled) {
    //             setState(result.assets[0], "avatar");
    //         }
    //     }
    // }

    const validate = () => {
        for (let i of fields) {
            if (!(i.field in user) || user[i.field] === "") {
                setMsg(`Vui lòng nhập ${i.label}!`);
                return false;
            }
        }

        if (user.password !== user.confirm) {
            setMsg("Mật khẩu không khớp!");
            return false;
        }

        return true;
    };

    const register = async () => {
        if (validate() === true) {
            try {
                setLoading(true);

                let form = new FormData();
                for (let key in user)
                    if (key !== 'confirm') {
                        if (key === 'avatar') {
                            form.append(key, {
                                uri: user.avatar.uri,
                                name: user.avatar.fileName,
                                type: user.avatar.type
                            })
                        } else
                            form.append(key, user[key]);
                    }

                const endpoint = accountType === "tenant" ? "tenant-register" : "landlord-register";
                await Apis.post(endpoints[endpoint], form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                alert("Đăng ký thành công!");
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Tiêu đề */}
                <Text style={styles.title}>
                    Đăng ký tài khoản {accountType === "tenant" ? "người thuê" : "chủ trọ"}
                </Text>

                {/* Nút chuyển đổi loại tài khoản */}
                <View style={styles.switchContainer}>
                    <Button
                        mode={accountType === "tenant" ? "contained" : "outlined"}
                        onPress={() => setAccountType("tenant")}
                        style={styles.switchButton}
                    >
                        Người thuê
                    </Button>
                    <Button
                        mode={accountType === "landlord" ? "contained" : "outlined"}
                        onPress={() => setAccountType("landlord")}
                        style={styles.switchButton}
                    >
                        Chủ trọ
                    </Button>
                </View>

                {/* Hiển thị thông báo lỗi */}
                <HelperText type="error" visible={msg} style={styles.errorText}>
                    {msg}
                </HelperText>

                {/* Hiển thị các trường thông tin */}
                {fields.map((i) => (
                    <TextInput
                        key={i.field}
                        label={i.label}
                        secureTextEntry={i.secureTextEntry}
                        right={<TextInput.Icon icon={i.icon} />}
                        value={user[i.field]}
                        onChangeText={(t) => setState(t, i.field)}
                        style={styles.input}
                    />
                ))}

                {/* <TouchableOpacity style={styles.m} onPress={pick}>
                <Text>Chọn ảnh đại diện...</Text>
            </TouchableOpacity> */}
                {user.avatar && <Image source={{ uri: user.avatar.uri }} style={styles.avatar} />}

                {/* Nút đăng ký */}
                <Button
                    onPress={register}
                    disabled={loading}
                    loading={loading}
                    mode="contained"
                    style={styles.registerButton}
                >
                    Đăng ký
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
        color: "#333",
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 16,
    },
    switchButton: {
        marginHorizontal: 8,
    },
    errorText: {
        color: "red",
        marginBottom: 8,
    },
    input: {
        marginBottom: 16,
        backgroundColor: "#fff",
    },
    registerButton: {
        marginTop: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
});

export default Register;