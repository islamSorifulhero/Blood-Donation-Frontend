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

// Mirrors just the role (never a token) into a plain, readable cookie. This is what
// middleware.ts reads to decide which dashboard a request is allowed into — a
// routing/UX guard only. Real authorization still happens on every API call via the
// Bearer access token, enforced by the backend's role middleware.
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
      // The access token is short-lived (15m) and only ever re-derived from the
      // httpOnly refresh cookie via /api/auth/refresh, so persisting it just makes
      // reloads snappier — worst case it's expired and the first request silently
      // refreshes it.
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        if (state?.user?.role) syncRoleCookie(state.user.role);
      },
    }
  )
);
