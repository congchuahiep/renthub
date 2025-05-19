import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import Apis, { endpoints } from "../config/Apis";

const PropertyList = () => {
    const [properties, setProperties] = useState([]); // Lưu danh sách dãy trọ
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu

    const propertyList = async () => {
        try {
            setLoading(true); // Bắt đầu tải dữ liệu
            let response = await Apis.get(endpoints.properties);
            console.log("Danh sách dãy trọ", response.data);
            setProperties(response.data); // Lưu dữ liệu vào state
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    useEffect(() => {
        propertyList(); // Gọi hàm lấy danh sách dãy trọ khi component được render
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" /> // Hiển thị vòng tròn tải khi đang tải dữ liệu
            ) : (
                <FlatList
                    data={properties} // Dữ liệu danh sách dãy trọ
                    keyExtractor={(item) => item.id.toString()} // Khóa duy nhất cho mỗi mục
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.address}>{item.address}</Text>
                            <Text style={styles.owner}>Chủ sở hữu: {item.owner.name}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f9f9f9",
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    address: {
        fontSize: 14,
        color: "#555",
        marginBottom: 5,
    },
    owner: {
        fontSize: 14,
        color: "#888",
    },
});

export default PropertyList;