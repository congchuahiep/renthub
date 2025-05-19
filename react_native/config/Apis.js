import axios from "axios";

// // Nhập biến môi trường
const BASE_URL = process.env.EXPO_PUBLIC_DJANGO_SERVER_URL;

export const endpoints = {
  'rentals': "/rentals/",
  'rental-details': (rentalId) => `/rentals/${rentalId}`,
  'login':"/o/token/",
  'chat':"/chats/chat/",
  'messages':(chat_id) =>  `/chats/${chat_id}`,
  'users':(id) => `/users/${id}`,
  'user':"/users/",
  'current-user':"/users/current-user/",
  'properties':'/properties/',
}

export const authApis = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

export default axios.create({
  baseURL: BASE_URL
});