import { get, ref, serverTimestamp, set } from "firebase/database";
import { db } from "../config/config";

export const createChat = async (chatId, userIds) => {
  const chatRef = ref(db, `chats/${chatId}`);
  
  // Kiểm tra xem chat đã tồn tại chưa
  const snapshot = await get(chatRef);
  
  if (!snapshot.exists()) {
    // Nếu chưa tồn tại thì tạo mới
    await set(chatRef, {
      users: userIds,       // danh sách user trong chat
      createdAt: serverTimestamp(),
      messages: {}
    });
  }
  // Nếu đã có rồi thì không làm gì
};
