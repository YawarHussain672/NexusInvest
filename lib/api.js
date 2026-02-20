import axios from 'axios';

// Ensure this works for both client-side and server-side calls
// In Next.js, relative paths generally work fine if it's hitting its own /api routes on the same domain
// Check for browser environment safely
const isBrowser = typeof window !== 'undefined';

const API = axios.create({
  baseURL: '/api', 
});

if (isBrowser) {
  API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });
}

export default API;
