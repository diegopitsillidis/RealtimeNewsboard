import { create } from "zustand";

type Role = "user" | "admin";

type AuthState = {
  token: string | null;
  username: string | null;
  role: Role | null;
  setAuth: (data: { token: string; username: string; role: string }) => void;
  logout: () => void;
  loadFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: null,
  role: null,
  setAuth: ({ token, username, role }) => {
    const auth = { token, username, role };
    localStorage.setItem("auth", JSON.stringify(auth));
    set({ token, username, role: role as Role });
  },
  logout: () => {
    localStorage.removeItem("auth");
    set({ token: null, username: null, role: null });
  },
  loadFromStorage: () => {
    const raw = localStorage.getItem("auth");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      set({
        token: parsed.token ?? null,
        username: parsed.username ?? null,
        role: parsed.role ?? null,
      });
    } catch {
      // if corrupted, clear
      localStorage.removeItem("auth");
    }
  },
}));
