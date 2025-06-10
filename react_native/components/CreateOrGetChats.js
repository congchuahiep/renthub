import { get, push, ref, serverTimestamp } from 'firebase/database';
import { database } from '../config/config';

export const CreateGetChat = async (currentUserId, otherUserId) => {
  const chatsRef = ref(database, 'chats');
  let chatId = null;

  const snapshot = await get(chatsRef);
  if (snapshot.exists()) {
    const chats = snapshot.val();
    for (const id in chats) {
      const chat = chats[id];
      if (
        chat.participants.includes(currentUserId) &&
        chat.participants.includes(otherUserId)
      ) {
        chatId = id; 
        break;
      }
    }
  }

  if (!chatId) {
    console.log(currentUserId, otherUserId);
    const newChat = {
      participants: [currentUserId, otherUserId],
      last_message: '',
      last_update: serverTimestamp(),
    };
    const newChatRef = push(chatsRef, newChat);
    chatId = newChatRef.key; // Lấy ID của cuộc trò chuyện mới
  }

  return chatId; // Trả về ID của cuộc trò chuyện
};