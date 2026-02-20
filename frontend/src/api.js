import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Proxy will also work, but putting absolute URL for now
});

// Interceptor to add JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
