import axios from "axios"
import { DJANGO_SERVER_URL } from "@env"

// Nhập biến môi trường, biến đổi thành chuỗi
const BASE_URL = String(DJANGO_SERVER_URL)

export const endpoints = {
  'rentals': "/rentals/"
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