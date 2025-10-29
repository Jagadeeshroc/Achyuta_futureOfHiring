// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Set the Authorization header for all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; // ✅ default export
