import axios from "axios";

// Nhập biến môi trường
const BASE_URL = process.env.EXPO_PUBLIC_DJANGO_SERVER_URL;

export const endpoints = {
  rentals: "/rentals/",
  rentalDetails: (rentalId) => `/rentals/${rentalId}`,

  roomseekings: "/roomseekings/",
  roomseekingsDetails: (roomseekingId) => `/roomseekings/${roomseekingId}`,

  login: "/o/token/",

  user: (id) => `/users/${id}`,
  users: "/users/",
  currentUser: "/users/current-user/",

  'rental-comments': (rentalId) => `/rentals/${rentalId}/comments/`,
  'rental-comments-replies': (rentalId, commentId) => `/rentals/${rentalId}/comments/${commentId}/replies/`,
  'roomseeking-comments': (roomseekingId) => `/roomseekings/${roomseekingId}/comments/`,
  'roomseeking-comments-replies': (roomseekingId, commentId) => `/roomseekings/${roomseekingId}/comments/${commentId}/replies/`,

  properties: "/properties/",
  propertyDetails: (property_id) => `/properties/${property_id}/`,
  propertiesUserList: "/properties/my-properties/",

  tenantRegister: "/users/tenant-register/",
  landlordRegister: "/users/landlord-register/",

  follow: (user_id) => `/follower/${user_id}/follow/`,
  "is-follow": (user_id) => `/follower/${user_id}/is-following/`,
  "follow-delete": (user_id) => `/follower/${user_id}/follower/`,

  provinces: "/provinces/",
  districts: "/districts/",
  wards: "/wards/",

  utilities: "/utilities/"
};

export const authApis = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axios.create({
  baseURL: BASE_URL,
});
