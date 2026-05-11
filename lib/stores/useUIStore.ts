// lib/stores/useUIStore.ts
// Global UI state — nav, modals, toasts, theme

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ── Toast types ───────────────────────────────────────────────────────────────
export type ToastVariant = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number; // ms, default 4000
}

// ── Modal registry — add new modal ids here as the app grows ─────────────────
export type ModalId =
  | "testimonial-form"
  | "contact-form"
  | "project-form"
  | "post-form"
  | "delete-confirm"
  | null;

interface UIState {
  // Navigation
  isMobileMenuOpen: boolean;
  activeSection: string | null;         // for scroll-spy highlighting

  // Theme
  theme: "light" | "dark";

  // Modals
  activeModal: ModalId;
  modalPayload: Record<string, unknown>; // optional data passed to modal

  // Toasts
  toasts: Toast[];

  // Actions — Nav
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setActiveSection: (section: string | null) => void;

  // Actions — Theme
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;

  // Actions — Modal
  openModal: (id: ModalId, payload?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Actions — Toasts
  addToast: (message: string, variant?: ToastVariant, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      isMobileMenuOpen: false,
      activeSection: null,
      theme: "dark",
      activeModal: null,
      modalPayload: {},
      toasts: [],

      // ── Nav ────────────────────────────────────────────────────────────────
      toggleMobileMenu: () =>
        set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),

      closeMobileMenu: () => set({ isMobileMenuOpen: false }),

      setActiveSection: (section) => set({ activeSection: section }),

      // ── Theme ──────────────────────────────────────────────────────────────
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

      setTheme: (theme) => set({ theme }),

      // ── Modals ─────────────────────────────────────────────────────────────
      openModal: (id, payload = {}) =>
        set({ activeModal: id, modalPayload: payload }),

      closeModal: () =>
        set({ activeModal: null, modalPayload: {} }),

      // ── Toasts ─────────────────────────────────────────────────────────────
      addToast: (message, variant = "info", duration = 4000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const toast: Toast = { id, message, variant, duration };

        set((s) => ({ toasts: [...s.toasts, toast] }));

        // Auto-dismiss
        setTimeout(() => get().removeToast(id), duration);
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      clearToasts: () => set({ toasts: [] }),
    }),
    {
      name: "prime-folio-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }), // only persist theme
    }
  )
);

// ── Convenience toast helpers (use these instead of addToast directly) ────────
export const toast = {
  success: (msg: string, duration?: number) =>
    useUIStore.getState().addToast(msg, "success", duration),
  error: (msg: string, duration?: number) =>
    useUIStore.getState().addToast(msg, "error", duration),
  info: (msg: string, duration?: number) =>
    useUIStore.getState().addToast(msg, "info", duration),
  warning: (msg: string, duration?: number) =>
    useUIStore.getState().addToast(msg, "warning", duration),
};

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectTheme = (s: UIState) => s.theme;
export const selectToasts = (s: UIState) => s.toasts;
export const selectActiveModal = (s: UIState) => s.activeModal;
export const selectModalPayload = (s: UIState) => s.modalPayload;
