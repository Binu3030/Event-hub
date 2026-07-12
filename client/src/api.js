import axios from 'axios';

// Link directly to your backend Express server running on port 5000
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically inject JWT session tokens into outgoing request headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;