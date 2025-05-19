import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import axiosInstance, { endpoints } from "../config/Apis";




const UserInfo = () => {

    const [user, setUser] = useState([]);
    // const [cu]

    const fetchUserList = async () => {
        try {
            const response = await axiosInstance.get(endpoints.user, {

            });
            console.log("API Response:", response.data);
            setUser(response.data.results || response.data);
        } catch (error) {
            console.error("Error fetching rentals:", error);
        }
    };
    useEffect(() => {
        console.log("Fetching user...");

        fetchUserList();
    }, []);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Danh sách người dùng trong hệ thống</Text>
            <FlatList
                data={user}
                kkeyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    
                    <View>
                        <Text style={styles.itemTitle}>{item.first_name} {item.last_name}</Text>
                        <Text>{item.email}</Text>
                        <Text>Loại: {item.user_type}</Text>
                    </View>
                        
                    
                )}
            />
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    item: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default UserInfo;