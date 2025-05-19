import axios from "axios";

// Nhập biến môi trường, biến đổi thành chuỗi
const BASE_URL = 'http://10.17.64.120:8000';

// String(process.env.EXPO_PUBLIC_DJANGO_SERVER_URL)

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