import axios from "axios";

// // Nhập biến môi trường
const BASE_URL = 'http://192.168.1.3:8000';
// 

export const endpoints = {
  'rentals': "/rentals/",
  'rental-details': (rentalId) => `/rentals/${rentalId}`,
  'roomseekings':"/roomseekings/",
  'roomseekings-details': (roomseekingId)=> `/roomseekings/${roomseekingId}`,
  'login':"/o/token/",
  'user':(id) => `/users/${id}`,
  'users':"/users/",
  'current-user':"/users/current-user/",
  'properties':'/properties/',
  'property-details':(property_id)=> `/properties/${property_id}/`,
  'tenant-register':"/users/tenant-register/",
  'landlord-register':"/users/landlord-register/",
  'follow':(user_id)=>  `/follower/${user_id}/follow/`,
  'is-follow':(user_id)=> `/follower/${user_id}/is-following/`,
  'follow-delete':(user_id)=> `/follower/${user_id}/follower/`,
  'provinces': "/provinces/",
	'districts': "/districts/",
	'wards': "/wards/",
  'rental-comments':(rentalId)=>`/rentals/${rentalId}/comments/`,
  'rental-comments-replies':(rentalId, commentId)=>`/rentals/${rentalId}/comments/${commentId}/replies/`,
  'roomseeking-comments':(roomseekingId)=>`/roomseekings/${roomseekingId}/comments/`,
  'roomseeking-comments-replies':(roomseekingId, commentId)=>`/roomseekings/${roomseekingId}/comments/${commentId}/replies/`,
  

}

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
