import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api" 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const refreshRes = await axios.post(
            (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api") + "/auth/refresh",
            {},
            {
              headers: { Authorization: `Bearer ${refreshToken}` }
            }
          );
          const newToken = refreshRes.data.access_token;
          localStorage.setItem("access_token", newToken);
          useAuthStore.getState().setToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
      } else {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
