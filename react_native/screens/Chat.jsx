import { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";

const ChatScreen = ({ chatId, userId }) => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");

	// Hàm gọi API để lấy tin nhắn mới
	const fetchMessages = async () => {
		try {
			const response = await fetch(
				`http://your-django-api-url/chat/${chatId}/messages/`
			);
			const data = await response.json();
			setMessages(data.messages);
		} catch (error) {
			console.error("Error fetching messages:", error);
		}
	};

	// Gửi tin nhắn
	const sendMessage = async () => {
		if (newMessage) {
			try {
				await fetch("http://your-django-api-url/chat/send/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ chatId, message: newMessage, userId }),
				});
				setNewMessage("");
				fetchMessages(); // Gọi lại API để cập nhật tin nhắn sau khi gửi
			} catch (error) {
				console.error("Error sending message:", error);
			}
		}
	};

	useEffect(() => {
		// Lấy tin nhắn ngay khi vào màn hình
		fetchMessages();

		// Cập nhật tin nhắn mỗi 3 giây
		const intervalId = setInterval(fetchMessages, 3000);

		return () => clearInterval(intervalId); // Dọn dẹp khi màn hình bị rời đi
	}, [chatId]);

	return (
		<View>
			<FlatList
				data={messages}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => <Text>{item.content}</Text>}
			/>
			<TextInput
				placeholder="Type a message"
				value={newMessage}
				onChangeText={setNewMessage}
			/>
			<Button title="Send" onPress={sendMessage} />
		</View>
	);
};

export default ChatScreen;
