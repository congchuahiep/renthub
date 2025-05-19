import { useNavigation } from "@react-navigation/native";
import { onValue, ref } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { db } from "../config/config";
import { MyUserContext } from "../config/context";

const ChatListScreen = () => {
  const user = useContext(MyUserContext);
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) return;

    const chatsRef = ref(db, "chats");
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      const filtered = [];

      for (const chatId in data) {
        if (data[chatId].members?.includes(user.id.toString())) {
          filtered.push({ id: chatId, ...data[chatId] });
        }
      }

      setChats(filtered);
    });

    return () => unsubscribe();
  }, [user]);

  const goToChat = (chat) => {
    navigation.navigate("ChatScreen", { chatId: chat.id });
  };

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => goToChat(item)}>
          <View style={{ padding: 16, borderBottomWidth: 1 }}>
            <Text>Chat ID: {item.id}</Text>
            <Text>Members: {item.members.join(", ")}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default ChatListScreen;
