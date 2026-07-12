import { create } from "zustand";

export const useUIStore = create((set, get) => ({
  toasts: [],
  theme: localStorage.getItem("notely-theme") || "system",

  // Toasts Actions
  addToast: (message, type = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Theme Actions
  setTheme: (theme) => {
    localStorage.setItem("notely-theme", theme);
    set({ theme });
    get().applyTheme();
  },

  applyTheme: () => {
    const theme = get().theme;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.add("light");
    } else {
      // System default
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(systemDark ? "dark" : "light");
    }
  },

  initTheme: () => {
    get().applyTheme();
    // Watch for system color scheme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (get().theme === "system") {
        get().applyTheme();
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  },
}));
