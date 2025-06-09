import { off, onValue, ref } from 'firebase/database';
import { database } from '../config/config';

// Lấy danh sách cuộc trò chuyện của người dùng
export const getUserChats = (userId, callback) => {
  const chatsRef = ref(database, 'chats');

  const listener = onValue(chatsRef, (snapshot) => {
    const chats = [];
    const data = snapshot.val();
    for (const id in data) {
      const chat = data[id];
      const isParticipant = chat.participants.some((participant) => participant.id === userId);
      if (isParticipant) {
        chats.push({
          id,
          ...chat,
        });
      }
    }

    // Sắp xếp theo last_update mới nhất
    chats.sort((a, b) => new Date(b.last_update) - new Date(a.last_update));

    callback(chats);
  });

  return () => off(chatsRef, 'value', listener);
};
