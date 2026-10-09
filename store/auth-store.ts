import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  hasHydrated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  setHasHydrated: (v: boolean) => void;
}

function syncRoleCookie(role: string | null) {
  if (typeof document === "undefined") return;
  if (role) {
    Cookies.set("role", role, { expires: 30, sameSite: "lax" });
  } else {
    Cookies.remove("role");
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,

      setAuth: (user, accessToken) => {
        syncRoleCookie(user.role);
        set({ user, accessToken });
      },
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAuth: () => {
        syncRoleCookie(null);
        set({ user: null, accessToken: null });
      },
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "rakto-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        if (state?.user?.role) syncRoleCookie(state.user.role);
      },
    }
  )
);