import axios from "axios";

// In production (Vercel), VITE_API_URL must be set to your Render backend URL
// e.g. https://nextgen-edutrack.onrender.com/api/v1
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Global response interceptor — handle 401 gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect — let Redux handle it
    }
    return Promise.reject(error);
  }
);
