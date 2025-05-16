import { create } from "zustand";

interface ThemeState {
  theme: string | null;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: localStorage.getItem("theme") || "dark",
  setTheme: (theme: string) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },
}));
