import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserResponse } from "../types";

interface AuthState {
  isAuthenticated: boolean;
  user: UserResponse | null;
  keycloakId: string | null;
  token: string | null;
  setAuth: (user: UserResponse, keycloakId: string, token: string) => void;
  clearAuth: () => void;
  setUser: (user: UserResponse) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      keycloakId: null,
      token: null,
      setAuth: (user, keycloakId, token) =>
        set({ isAuthenticated: true, user, keycloakId, token }),
      clearAuth: () =>
        set({ isAuthenticated: false, user: null, keycloakId: null, token: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "fitness-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
