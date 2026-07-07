import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

if (typeof window !== 'undefined') {
  const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
  if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const getTrips = (p) => API.get('/trips', { params: p });
export const getTripBySlug = (s) => API.get(`/trips/slug/${s}`);
export const submitInquiry = (d) => API.post('/inquiries', d);
export const getReviews = (id) => API.get(`/reviews/trip/${id}`);
export const addReview = (d) => API.post('/reviews', d);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);
export const registerUser = (d) => API.post('/users/register', d);
export const loginUser = (d) => API.post('/users/login', d);
export const logoutUser = () => API.post('/users/logout');
export const getMyInquiries = () => API.get('/users/my-inquiries');
export const saveTrip = (id) => API.post(`/users/save-trip/${id}`);
export const adminLogin = (d) => API.post('/auth/login', d);
export const adminLogout = () => API.post('/auth/logout');
export const getAllTrips = () => API.get('/trips/admin/all');
export const createTrip = (d) => API.post('/trips', d);
export const updateTrip = (id, d) => API.put(`/trips/${id}`, d);
export const deleteTrip = (id) => API.delete(`/trips/${id}`);
export const getInquiries = () => API.get('/inquiries');
export const updateInquiry = (id, d) => API.put(`/inquiries/${id}`, d);

export const getMe = () => API.get('/users/me');

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('userToken', token);
  } else {
    delete API.defaults.headers.common['Authorization'];
    localStorage.removeItem('userToken');
  }
};

export default API;