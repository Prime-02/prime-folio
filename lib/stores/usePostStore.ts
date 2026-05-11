// lib/stores/usePostStore.ts
// Manages blog post metadata — content itself is loaded from MDX files
// Now with pagination support

import { create } from "zustand";
import { authFetch } from "./useAuthStore";
import type { Post } from "@/lib/types";

interface PostFilters {
  tag: string | null;
  featured: boolean | null;
  showAll: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PostState {
  // Data
  posts: Post[];
  activePost: Post | null;
  filters: PostFilters;
  pagination: PaginationInfo | null;

  // Status
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Public actions
  fetchPosts: (token?: string, page?: number, limit?: number) => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<void>;
  setFilter: (filters: Partial<PostFilters>) => void;
  clearFilters: () => void;
  nextPage: (token?: string) => Promise<void>;
  previousPage: (token?: string) => Promise<void>;
  goToPage: (page: number, token?: string) => Promise<void>;

  // Admin actions
  createPost: (token: string, data: Partial<Post>) => Promise<boolean>;
  updatePost: (
    token: string,
    slug: string,
    data: Partial<Post>,
  ) => Promise<boolean>;
  deletePost: (token: string, slug: string) => Promise<boolean>;

  // Helpers
  clearError: () => void;
  clearActivePost: () => void;
}

const DEFAULT_FILTERS: PostFilters = {
  tag: null,
  featured: null,
  showAll: false,
};

const DEFAULT_PAGE_SIZE = 10;

export const usePostStore = create<PostState>()((set, get) => ({
  posts: [],
  activePost: null,
  filters: DEFAULT_FILTERS,
  pagination: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  // ── Fetch posts (supports admin "showAll" mode + pagination) ───────────────
  fetchPosts: async (token?, page = 1, limit = DEFAULT_PAGE_SIZE) => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();

      // Add filter params
      if (filters.tag) params.set("tag", filters.tag);
      if (filters.featured === true) params.set("featured", "true");
      if (filters.showAll) params.set("all", "true");

      // Add pagination params
      params.set("page", page.toString());
      params.set("limit", limit.toString());

      const url = `/api/blog?${params.toString()}`;

      // Use authFetch if token provided (for admin "all" requests),
      // otherwise use regular fetch (for public requests)
      const res =
        filters.showAll && token
          ? await authFetch(token, url)
          : await fetch(url);

      const { data } = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to fetch posts");

      // Ensure we always set posts as an array
      set({
        posts: Array.isArray(data.data)
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
        posts: [], // Reset to empty array on error
        pagination: null,
      });
    }
  },

  // ── Fetch single post metadata by slug ────────────────────────────────────
  // Note: MDX content is loaded separately via next-mdx-remote or similar
  fetchPostBySlug: async (slug) => {
    set({ isLoading: true, error: null, activePost: null });
    try {
      const res = await fetch(`/api/blog/${slug}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Post not found");

      // Handle both wrapped and unwrapped responses
      set({
        activePost: data.data || data,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  // ── Filters ────────────────────────────────────────────────────────────────
  setFilter: (filters) => {
    set((s) => ({
      filters: { ...s.filters, ...filters },
      // Reset to first page when filters change
      pagination: null,
    }));
    // Don't auto-fetch when changing to showAll since it needs auth
    if (!filters.showAll) {
      get().fetchPosts(
        undefined,
        1,
        get().pagination?.limit || DEFAULT_PAGE_SIZE,
      );
    }
  },

  clearFilters: () => {
    set({
      filters: DEFAULT_FILTERS,
      pagination: null, // Reset pagination
      posts: [], // Clear posts while refetching
    });
    get().fetchPosts(
      undefined,
      1,
      get().pagination?.limit || DEFAULT_PAGE_SIZE,
    );
  },

  // ── Pagination navigation ──────────────────────────────────────────────────
  nextPage: async (token?) => {
    const { pagination } = get();
    if (pagination?.hasNextPage) {
      await get().fetchPosts(token, pagination.page + 1, pagination.limit);
    }
  },

  previousPage: async (token?) => {
    const { pagination } = get();
    if (pagination?.hasPreviousPage) {
      await get().fetchPosts(token, pagination.page - 1, pagination.limit);
    }
  },

  goToPage: async (page, token?) => {
    const { pagination } = get();
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      await get().fetchPosts(
        token,
        page,
        pagination?.limit || DEFAULT_PAGE_SIZE,
      );
    }
  },

  // ── Admin: Create ──────────────────────────────────────────────────────────
  createPost: async (token, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, "/api/blog", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create post");

      // After creating, refresh the current page
      const { pagination } = get();
      set({ isSubmitting: false });

      // Refresh current page to include new post
      await get().fetchPosts(
        token,
        pagination?.page || 1,
        pagination?.limit || DEFAULT_PAGE_SIZE,
      );

      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  // ── Admin: Update ──────────────────────────────────────────────────────────
  updatePost: async (token, slug, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, `/api/blog/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update post");

      // Handle response data (might be wrapped or unwrapped)
      const updatedPost = json.data || json;

      // Update the post in the current list if it exists
      set((s) => ({
        posts: Array.isArray(s.posts)
          ? s.posts.map((p) => (p.slug === slug ? updatedPost : p))
          : [],
        activePost: s.activePost?.slug === slug ? updatedPost : s.activePost,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  // ── Admin: Delete ──────────────────────────────────────────────────────────
  deletePost: async (token, slug) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, `/api/blog/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Failed to delete post");
      }

      const { pagination, posts } = get();

      // Ensure posts is an array before filtering
      const currentPosts = Array.isArray(posts) ? posts : [];
      const updatedPosts = currentPosts.filter((p) => p.slug !== slug);

      // If we deleted the last item on the page and there are previous pages,
      // go to the previous page. Otherwise, just update the list.
      if (updatedPosts.length === 0 && pagination?.hasPreviousPage) {
        set({ isSubmitting: false });
        await get().fetchPosts(token, pagination.page - 1, pagination.limit);
      } else {
        set((s) => ({
          posts: updatedPosts,
          activePost: s.activePost?.slug === slug ? null : s.activePost,
          isSubmitting: false,
        }));

        // Refresh to get accurate counts
        if (token) {
          await get().fetchPosts(
            token,
            pagination?.page || 1,
            pagination?.limit || DEFAULT_PAGE_SIZE,
          );
        }
      }

      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
  clearActivePost: () => set({ activePost: null }),
}));

// ── Derived selectors ─────────────────────────────────────────────────────────
export const selectFeaturedPosts = (s: PostState) => {
  if (!Array.isArray(s.posts)) return [];
  return s.posts.filter((p) => p.featured);
};

export const selectAllPostTags = (s: PostState) => {
  if (!Array.isArray(s.posts)) return [];
  return [...new Set(s.posts.flatMap((p) => p.tags))].sort();
};

export const selectPagination = (s: PostState) => s.pagination;

export const selectIsFirstPage = (s: PostState) =>
  !s.pagination?.hasPreviousPage;

export const selectIsLastPage = (s: PostState) => !s.pagination?.hasNextPage;
