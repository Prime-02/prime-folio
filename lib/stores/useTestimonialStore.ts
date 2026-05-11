// lib/stores/useTestimonialStore.ts
// Public approved testimonials + visitor submission + admin approval workflow
// Now with pagination support

import { create } from "zustand";
import { authFetch } from "./useAuthStore";
import type { Testimonial } from "@/lib/types";

export interface TestimonialSubmission {
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number;
}

type AdminFilter = "all" | "pending" | "approved";

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface TestimonialState {
  // Public
  testimonials: Testimonial[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;

  // Visitor submission
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;

  // Admin
  adminTestimonials: Testimonial[];
  adminPagination: PaginationInfo | null;
  adminFilter: AdminFilter;
  isAdminLoading: boolean;

  // Public actions
  fetchTestimonials: (params?: {
    featured?: boolean;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  nextPage: () => Promise<void>;
  previousPage: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;

  // Visitor actions
  submitTestimonial: (data: TestimonialSubmission) => Promise<boolean>;
  resetSubmitState: () => void;

  // Admin actions
  fetchAdminTestimonials: (params: {
    token: string;
    filter?: AdminFilter;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  adminNextPage: (token: string) => Promise<void>;
  adminPreviousPage: (token: string) => Promise<void>;
  adminGoToPage: (page: number, token: string) => Promise<void>;
  approveTestimonial: (token: string, id: string) => Promise<boolean>;
  featureTestimonial: (
    token: string,
    id: string,
    featured: boolean,
  ) => Promise<boolean>;
  deleteTestimonial: (token: string, id: string) => Promise<boolean>;
  setAdminFilter: (token: string, filter: AdminFilter) => Promise<void>;

  clearError: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

export const useTestimonialStore = create<TestimonialState>()((set, get) => ({
  testimonials: [],
  pagination: null,
  isLoading: false,
  error: null,

  isSubmitting: false,
  submitSuccess: false,
  submitError: null,

  adminTestimonials: [],
  adminPagination: null,
  adminFilter: "all",
  isAdminLoading: false,

  // ── Public: fetch approved testimonials ────────────────────────────────────
  fetchTestimonials: async (params = {}) => {
    const { featured, page = 1, limit = DEFAULT_PAGE_SIZE } = params;
    set({ isLoading: true, error: null });
    try {
      const searchParams = new URLSearchParams();
      if (featured) searchParams.set("featured", "true");
      searchParams.set("page", page.toString());
      searchParams.set("limit", limit.toString());

      const res = await fetch(`/api/testimonials?${searchParams.toString()}`);
      const { data } = await res.json();
      console.log(JSON.stringify(data));

      if (!res.ok)
        throw new Error(data.error ?? "Failed to fetch testimonials");

      set({
        testimonials: Array.isArray(data.data)
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
        testimonials: [],
        pagination: null,
      });
    }
  },

  // ── Public: pagination navigation ──────────────────────────────────────────
  nextPage: async () => {
    const { pagination } = get();
    if (pagination?.hasNextPage) {
      await get().fetchTestimonials({
        page: pagination.page + 1,
        limit: pagination.limit,
      });
    }
  },

  previousPage: async () => {
    const { pagination } = get();
    if (pagination?.hasPreviousPage) {
      await get().fetchTestimonials({
        page: pagination.page - 1,
        limit: pagination.limit,
      });
    }
  },

  goToPage: async (page) => {
    const { pagination } = get();
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      await get().fetchTestimonials({
        page,
        limit: pagination?.limit || DEFAULT_PAGE_SIZE,
      });
    }
  },

  // ── Visitor: submit testimonial ────────────────────────────────────────────
  submitTestimonial: async (data) => {
    set({ isSubmitting: true, submitError: null, submitSuccess: false });
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      set({ isSubmitting: false, submitSuccess: true });
      return true;
    } catch (e: any) {
      set({ isSubmitting: false, submitError: e.message });
      return false;
    }
  },

  resetSubmitState: () => set({ submitSuccess: false, submitError: null }),

  // ── Admin: fetch all testimonials (with filter + pagination) ───────────────
  fetchAdminTestimonials: async ({
    token,
    filter = "all",
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
  }) => {
    set({ isAdminLoading: true, error: null, adminFilter: filter });
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("filter", filter);
      params.set("page", page.toString());
      params.set("limit", limit.toString());

      const res = await authFetch(
        token,
        `/api/admin/testimonials?${params.toString()}`,
      );
      const { data } = await res.json();

      if (!res.ok)
        throw new Error(data.error ?? "Failed to fetch testimonials");

      set({
        adminTestimonials: Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [],
        adminPagination: data.pagination || null,
        isAdminLoading: false,
      });
    } catch (e: any) {
      set({
        error: e.message,
        isAdminLoading: false,
        adminTestimonials: [],
        adminPagination: null,
      });
    }
  },

  // ── Admin: pagination navigation ──────────────────────────────────────────
  adminNextPage: async (token) => {
    const { adminPagination, adminFilter } = get();
    if (adminPagination?.hasNextPage) {
      await get().fetchAdminTestimonials({
        token,
        filter: adminFilter,
        page: adminPagination.page + 1,
        limit: adminPagination.limit,
      });
    }
  },

  adminPreviousPage: async (token) => {
    const { adminPagination, adminFilter } = get();
    if (adminPagination?.hasPreviousPage) {
      await get().fetchAdminTestimonials({
        token,
        filter: adminFilter,
        page: adminPagination.page - 1,
        limit: adminPagination.limit,
      });
    }
  },

  adminGoToPage: async (page, token) => {
    const { adminPagination, adminFilter } = get();
    if (page >= 1 && page <= (adminPagination?.totalPages || 1)) {
      await get().fetchAdminTestimonials({
        token,
        filter: adminFilter,
        page,
        limit: adminPagination?.limit || DEFAULT_PAGE_SIZE,
      });
    }
  },

  // ── Admin: approve ─────────────────────────────────────────────────────────
  approveTestimonial: async (token, id) => {
    try {
      const res = await authFetch(token, `/api/admin/testimonials/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ approved: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to approve");

      set((s) => ({
        adminTestimonials: Array.isArray(s.adminTestimonials)
          ? s.adminTestimonials.map((t) =>
              t.id === id ? { ...t, approved: true } : t,
            )
          : [],
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message });
      return false;
    }
  },

  // ── Admin: feature / unfeature ─────────────────────────────────────────────
  featureTestimonial: async (token, id, featured) => {
    try {
      const res = await authFetch(token, `/api/admin/testimonials/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ featured }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update");

      set((s) => ({
        adminTestimonials: Array.isArray(s.adminTestimonials)
          ? s.adminTestimonials.map((t) =>
              t.id === id ? { ...t, featured } : t,
            )
          : [],
        // Also update public testimonials if approved
        testimonials: Array.isArray(s.testimonials)
          ? s.testimonials.map((t) =>
              t.id === id && t.approved ? { ...t, featured } : t,
            )
          : [],
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message });
      return false;
    }
  },

  // ── Admin: delete ──────────────────────────────────────────────────────────
  deleteTestimonial: async (token, id) => {
    try {
      const res = await authFetch(token, `/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Failed to delete");
      }

      const { adminPagination, adminTestimonials, adminFilter } = get();
      const currentAdminTestimonials = Array.isArray(adminTestimonials)
        ? adminTestimonials
        : [];
      const updatedAdminTestimonials = currentAdminTestimonials.filter(
        (t) => t.id !== id,
      );

      // If we deleted the last item on the page and there are previous pages,
      // go to the previous page
      if (
        updatedAdminTestimonials.length === 0 &&
        adminPagination?.hasPreviousPage
      ) {
        set({ isAdminLoading: false });
        await get().fetchAdminTestimonials({
          token,
          filter: adminFilter,
          page: adminPagination.page - 1,
          limit: adminPagination.limit,
        });
      } else {
        set((s) => ({
          adminTestimonials: updatedAdminTestimonials,
          testimonials: Array.isArray(s.testimonials)
            ? s.testimonials.filter((t) => t.id !== id)
            : [],
        }));

        // Refresh to get accurate counts
        await get().fetchAdminTestimonials({
          token,
          filter: adminFilter,
          page: adminPagination?.page || 1,
          limit: adminPagination?.limit || DEFAULT_PAGE_SIZE,
        });
      }

      return true;
    } catch (e: any) {
      set({ error: e.message });
      return false;
    }
  },

  // ── Admin: set filter and refetch ──────────────────────────────────────────
  setAdminFilter: async (token, filter) => {
    set({ adminFilter: filter });
    await get().fetchAdminTestimonials({ token, filter, page: 1 });
  },

  clearError: () => set({ error: null }),
}));

// ── Derived selectors ─────────────────────────────────────────────────────────
export const selectPendingCount = (s: TestimonialState) => {
  if (!Array.isArray(s.adminTestimonials)) return 0;
  return s.adminTestimonials.filter((t) => !t.approved).length;
};

export const selectFeaturedTestimonials = (s: TestimonialState) => {
  if (!Array.isArray(s.testimonials)) return [];
  return s.testimonials.filter((t) => t.featured);
};

export const selectPagination = (s: TestimonialState) => s.pagination;
export const selectAdminPagination = (s: TestimonialState) => s.adminPagination;

export const selectIsFirstPage = (s: TestimonialState) =>
  !s.pagination?.hasPreviousPage;

export const selectIsLastPage = (s: TestimonialState) =>
  !s.pagination?.hasNextPage;
