// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 30000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request headers');
    } else {
      console.log('❌ No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - TEMPORARILY DISABLE AUTO-REDIRECT
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Request successful:', response.status);
    return response;
  },
  (error) => {
    console.log('❌ Request failed:', error.response?.status);
    console.log('Error response data:', error.response?.data);
    
    // Don't auto-redirect for now - let the component handle it
    // if (error.response?.status === 401) {
    //   localStorage.removeItem('token');
    //   window.location.href = '/login';
    // }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;