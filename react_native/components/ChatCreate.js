import { get, push, ref, serverTimestamp } from 'firebase/database';
import { database } from '../config/config';

export const createOrGetChat = async (currentUser, user) => {
  const chatsRef = ref(database, 'chats');
  let chatId = null;

  const snapshot = await get(chatsRef);
  if (snapshot.exists()) {
    const chats = snapshot.val();
    for (const id in chats) {
      const chat = chats[id];
      const isCurrentUserParticipant = chat.participants.some(
        (participant) => participant.id === currentUser.id
      );
      const isUserParticipant = chat.participants.some(
        (participant) => participant.id === user.id
      );
      console.log(`Chat ID: ${id}, Current User Participant: ${isCurrentUserParticipant}, User Participant: ${isUserParticipant}`);
      if (isCurrentUserParticipant && isUserParticipant) {
        chatId = id;
        break;
      }
    }
  }

  if (!chatId) {
    const newChat = {
      participants: [currentUser, user],
      last_message: '',
      last_update: serverTimestamp(),
    };
    const newChatRef = push(chatsRef, newChat);
    chatId = newChatRef.key;
  }

  console.log('Final Chat ID:', chatId);
  return chatId;
};