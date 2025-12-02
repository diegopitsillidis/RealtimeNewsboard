import { create } from "zustand";

export type Theme = "light" | "dark";
export type Language = "en" | "es";

type SettingsState = {
  theme: Theme;
  language: Language;
  defaultCategory: string;
  setTheme: (t: Theme) => void;
  setLanguage: (l: Language) => void;
  setDefaultCategory: (c: string) => void;
  loadFromStorage: () => void;
};

const STORAGE_KEY = "userSettings";

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: "light",
  language: "en",
  defaultCategory: "General",

  setTheme: (theme) => {
    set((state) => {
      persist({ ...state, theme });
      return { ...state, theme };
    });
  },

  setLanguage: (language) => {
    set((state) => {
      persist({ ...state, language });
      return { ...state, language };
    });
  },

  setDefaultCategory: (defaultCategory) => {
    set((state) => {
      persist({ ...state, defaultCategory });
      return { ...state, defaultCategory };
    });
  },

  loadFromStorage: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      set((state) => ({
        ...state,
        ...parsed,
      }));
    } catch {
      // ignore broken data
    }
  },
}));

function persist(state: SettingsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
