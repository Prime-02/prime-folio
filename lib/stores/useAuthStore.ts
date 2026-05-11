// lib/stores/useAuthStore.ts
// Manages admin JWT session — login, logout, token persistence

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setHasHydrated: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      // ── Hydration flag ──────────────────────────────────────────────────────
      setHasHydrated: (val) => set({ _hasHydrated: val }),

      // ── Login ───────────────────────────────────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch("/api/admin/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            set({ error: data.error ?? "Login failed", isLoading: false });
            return false;
          }

          set({
            token: data.data.token,
            email: data.data.email,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch {
          set({ error: "Network error. Please try again.", isLoading: false });
          return false;
        }
      },

      // ── Logout ──────────────────────────────────────────────────────────────
      logout: () => {
        set({ token: null, email: null, isAuthenticated: false, error: null });
      },

      // ── Clear error ─────────────────────────────────────────────────────────
      clearError: () => set({ error: null }),
    }),
    {
      name: "prime-folio-auth", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // only persist token + email, not loading/error
        token: state.token,
        email: state.email,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Called once localStorage has been read and state is restored
        state?.setHasHydrated(true);
      },
    },
  ),
);

// ── Selector helpers (use these in components to avoid re-render overhead) ───
export const selectToken = (s: AuthState) => s.token;
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;
export const selectAuthError = (s: AuthState) => s.error;
export const selectAuthLoading = (s: AuthState) => s.isLoading;
export const selectHasHydrated = (s: AuthState) => s._hasHydrated;

// ── Typed fetch helper — attaches Bearer token automatically ─────────────────
export function authFetch(
  token: string | null,
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  if (!token) throw new Error("No token provided");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}
