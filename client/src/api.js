import axios from 'axios';

// Use the same proxy path as Next.js rewrites or a configured backend URL.
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
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