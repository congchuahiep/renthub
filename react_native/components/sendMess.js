import { push, ref, serverTimestamp } from 'firebase/database';
import { db } from '../config/config';


// Hàm gửi tin nhắn
export const sendMessage = (chatId, userId, messageText) => {
  const messagesRef = ref(db, `chats/${chatId}/messages`);
  return push(messagesRef, {
    userId,
    text: messageText,
    createdAt: serverTimestamp(),
  });
};