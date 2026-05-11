// lib/stores/useContactStore.ts
// Contact form submission + admin inbox management
// Now with pagination support

import { create } from "zustand";
import { authFetch } from "./useAuthStore";
import type { ContactMessage, MessageStatus } from "@/lib/types";

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ContactState {
  // Visitor form
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;

  // Admin inbox
  messages: ContactMessage[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  statusFilter: MessageStatus | "ALL";

  // Visitor actions
  submitContact: (data: ContactFormData) => Promise<boolean>;
  resetSubmitState: () => void;

  // Admin actions
  fetchMessages: (params: {
    token: string;
    status?: MessageStatus | "ALL";
    page?: number;
    limit?: number;
  }) => Promise<void>;
  nextPage: (token: string) => Promise<void>;
  previousPage: (token: string) => Promise<void>;
  goToPage: (page: number, token: string) => Promise<void>;
  updateMessageStatus: (
    token: string,
    id: string,
    status: MessageStatus,
  ) => Promise<boolean>;
  deleteMessage: (token: string, id: string) => Promise<boolean>;
  setStatusFilter: (
    token: string,
    status: MessageStatus | "ALL",
  ) => Promise<void>;

  clearError: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

export const useContactStore = create<ContactState>()((set, get) => ({
  isSubmitting: false,
  submitSuccess: false,
  submitError: null,

  messages: [],
  pagination: null,
  isLoading: false,
  error: null,
  statusFilter: "ALL",

  // ── Visitor: submit contact form ───────────────────────────────────────────
  submitContact: async (data) => {
    set({ isSubmitting: true, submitError: null, submitSuccess: false });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Failed to send message");
      set({ isSubmitting: false, submitSuccess: true });
      return true;
    } catch (e: any) {
      set({ isSubmitting: false, submitError: e.message });
      return false;
    }
  },

  resetSubmitState: () => set({ submitSuccess: false, submitError: null }),

  // ── Admin: fetch messages with optional status filter + pagination ─────────
  fetchMessages: async ({
    token,
    status = "ALL",
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
  }) => {
    set({ isLoading: true, error: null, statusFilter: status });
    try {
      const params = new URLSearchParams();
      if (status !== "ALL") params.set("status", status);
      params.set("page", page.toString());
      params.set("limit", limit.toString());

      const res = await authFetch(
        token,
        `/api/admin/contact?${params.toString()}`,
      );
      const { data } = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to fetch messages");

      set({
        messages: Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [],
        pagination: data.pagination || null,
        isLoading: false,
      });
    } catch (e: any) {
      set({
        error: e.message,
        isLoading: false,
        messages: [],
        pagination: null,
      });
    }
  },

  // ── Admin: pagination navigation ──────────────────────────────────────────
  nextPage: async (token) => {
    const { pagination, statusFilter } = get();
    if (pagination?.hasNextPage) {
      await get().fetchMessages({
        token,
        status: statusFilter,
        page: pagination.page + 1,
        limit: pagination.limit,
      });
    }
  },

  previousPage: async (token) => {
    const { pagination, statusFilter } = get();
    if (pagination?.hasPreviousPage) {
      await get().fetchMessages({
        token,
        status: statusFilter,
        page: pagination.page - 1,
        limit: pagination.limit,
      });
    }
  },

  goToPage: async (page, token) => {
    const { pagination, statusFilter } = get();
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      await get().fetchMessages({
        token,
        status: statusFilter,
        page,
        limit: pagination?.limit || DEFAULT_PAGE_SIZE,
      });
    }
  },

  // ── Admin: update message status ───────────────────────────────────────────
  updateMessageStatus: async (token, id, status) => {
    try {
      const res = await authFetch(token, `/api/admin/contact/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update status");

      set((s) => ({
        messages: Array.isArray(s.messages)
          ? s.messages.map((m) => (m.id === id ? { ...m, status } : m))
          : [],
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message });
      return false;
    }
  },

  // ── Admin: delete message ──────────────────────────────────────────────────
  deleteMessage: async (token, id) => {
    try {
      const res = await authFetch(token, `/api/admin/contact/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Failed to delete message");
      }

      const { pagination, messages, statusFilter } = get();
      const currentMessages = Array.isArray(messages) ? messages : [];
      const updatedMessages = currentMessages.filter((m) => m.id !== id);

      // If we deleted the last item on the page and there are previous pages,
      // go to the previous page
      if (updatedMessages.length === 0 && pagination?.hasPreviousPage) {
        set({ isLoading: false });
        await get().fetchMessages({
          token,
          status: statusFilter,
          page: pagination.page - 1,
          limit: pagination.limit,
        });
      } else {
        set((s) => ({
          messages: updatedMessages,
        }));

        // Refresh to get accurate counts
        await get().fetchMessages({
          token,
          status: statusFilter,
          page: pagination?.page || 1,
          limit: pagination?.limit || DEFAULT_PAGE_SIZE,
        });
      }

      return true;
    } catch (e: any) {
      set({ error: e.message });
      return false;
    }
  },

  // ── Admin: set filter and refetch ──────────────────────────────────────────
  setStatusFilter: async (token, status) => {
    set({ statusFilter: status });
    await get().fetchMessages({ token, status, page: 1 });
  },

  clearError: () => set({ error: null }),
}));

// ── Derived selectors ─────────────────────────────────────────────────────────
export const selectUnreadCount = (s: ContactState) => {
  if (!Array.isArray(s.messages)) return 0;
  return s.messages.filter((m) => m.status === "UNREAD").length;
};

export const selectMessagesByStatus =
  (status: MessageStatus) => (s: ContactState) => {
    if (!Array.isArray(s.messages)) return [];
    return s.messages.filter((m) => m.status === status);
  };

export const selectPagination = (s: ContactState) => s.pagination;

export const selectIsFirstPage = (s: ContactState) =>
  !s.pagination?.hasPreviousPage;

export const selectIsLastPage = (s: ContactState) => !s.pagination?.hasNextPage;
