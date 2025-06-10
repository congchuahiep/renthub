import { push, ref, update } from 'firebase/database';
import { database } from '../config/config';

export const sendMessage = async (chatId, userId, messageText) => {
  try {
    console.log(chatId, userId, messageText);
    if (!chatId || !userId || !messageText) {
      return;
    }

    const messagesRef = ref(database, `chats/${chatId}/messages`);
    await push(messagesRef, {
      userId,
      content: messageText,
      createdAt: new Date().toISOString(),
    });

    const chatRef = ref(database, `chats/${chatId}`);
    await update(chatRef, {
      last_message: messageText,
      last_update: new Date().toISOString(),
    });

    console.log('Message sent successfully and last_message updated.');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};