import { get, onChildAdded, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { sendMessage } from "../components/sendMess";
import { database } from "../config/config";

const ChatScreen = ({ route }) => {
  const { chatId, userId } = route.params;

  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [newMessage, setNewMessage] = useState([]);

  useEffect(() => {
    if (!chatId) return;
    setNewMessage("");
    const messagesRef = ref(database, `chats/${chatId}/messages`);

    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
      const newMsg = { id: snapshot.key, ...snapshot.val() };
      setMessages((prev) => {
        const exists = prev.find((msg) => msg.id === newMsg.id);
        return exists ? prev : [...prev, newMsg].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      });
    });

    get(ref(database, `chats/${chatId}/participants`)).then((snapshot) => {
      if (snapshot.exists()) {
        setParticipants(snapshot.val());
      }
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };

    
  }, [chatId]);

  const getAvatarByUserId = (userId) => {
    const participant = participants.find((p) => p.id === userId);
    return participant?.avatar || null;
  };

  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.userId === userId;
    const avatar = getAvatarByUserId(item.userId);

    return (
      <View style={[styles.messageWrapper, isCurrentUser ? styles.alignRight : styles.alignLeft]}>
        {!isCurrentUser && (
          avatar ? (
            <Avatar.Image size={36} source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Avatar.Text
              size={36}
              label=""
              style={[styles.avatar, { backgroundColor: "#ccc" }]}
            />
          )
        )}

        <View style={[styles.messageBubble, isCurrentUser ? styles.currentUser : styles.otherUser]}>
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.messageTime}>
            {new Date(item.createdAt).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessageItem}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <IconButton
					mode="contained"
					icon="send"
					onPress={() => {
            sendMessage(chatId, userId, newMessage);
            setNewMessage("");
          }}
					style={{ margin: 0, borderRadius: 16 }}
				/>
         
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>


  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "flex-end",
  },

  alignLeft: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },

  alignRight: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    flexDirection: "row-reverse", // avatar nằm bên phải nếu có
  },

  avatar: {
    marginHorizontal: 6,
  },

  messageBubble: {
    borderRadius: 10,
    padding: 10,
    maxWidth: "75%",
  },

  currentUser: {
    backgroundColor: "#DCF8C6",
  },

  otherUser: {
    backgroundColor: "#FFF",
  },

  messageText: {
    fontSize: 16,
    marginBottom: 5,
  },

  messageTime: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    marginRight: 8,
    backgroundColor: '#fff',
  },
});

export default ChatScreen;