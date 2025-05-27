import axios from "axios";

// // Nhập biến môi trường
const BASE_URL = 'http://192.168.1.3:8000'
// process.env.EXPO_PUBLIC_DJANGO_SERVER_URL;

export const endpoints = {
  'rentals': "/rentals/",
  'rental-details': (rentalId) => `/rentals/${rentalId}`,
  'login':"/o/token/",
  // 'chat':"/chats/chat/",
  // 'messages':(chat_id) =>  `/chats/${chat_id}`,
  'user':(id) => `/users/${id}`,
  'users':"/users/",
  'current-user':"/users/current-user/",
  'properties':'/properties/',
  'property-details':(property_id)=> `/properties/${property_id}/`,
  'tenant-register':"/users/tenant-register/",
  'landlord-register':"/users/landlord-register/",
  'follow':(user_id)=>  `/follower/${user_id}/follow/`,
  'is-follow':(user_id)=> `/follower/${user_id}/is-following`

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