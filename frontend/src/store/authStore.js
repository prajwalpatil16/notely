import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })(),
  login: (token, refreshToken, user) => {
    localStorage.setItem("access_token", token);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, refreshToken, user });
  },
  setToken: (token) => {
    localStorage.setItem("access_token", token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    set({ token: null, refreshToken: null, user: null });
  },
}));
