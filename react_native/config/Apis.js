import axios from "axios"
import { DJANGO_SERVER_URL } from "@env"

const BASE_URL = "http://10.0.2.2:8000/"

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