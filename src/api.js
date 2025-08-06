import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

// Set the Authorization header for all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});