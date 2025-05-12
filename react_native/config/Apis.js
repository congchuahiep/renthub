import axios from "axios"

// Nhập biến môi trường, biến đổi thành chuỗi
const BASE_URL = String(process.env.EXPO_PUBLIC_DJANGO_SERVER_URL)

export const endpoints = {
  'rentals': "/rentals/",
  'rental-details': (rentalId) => `/rentals/${rentalId}`
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