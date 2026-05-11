// lib/stores/useProjectStore.ts
// Manages projects — public listing, filters, and admin CRUD
// Now with pagination support

import { create } from "zustand";
import { authFetch } from "./useAuthStore";
import type { Project } from "@/lib/types";

interface ProjectFilters {
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

interface ProjectState {
  // Data
  projects: Project[];
  activeProject: Project | null;
  filters: ProjectFilters;
  pagination: PaginationInfo | null;

  // Status
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Public actions
  fetchProjects: (
    token?: string,
    page?: number,
    limit?: number,
  ) => Promise<void>;
  fetchProjectBySlug: (slug: string) => Promise<void>;
  setFilter: (filters: Partial<ProjectFilters>) => void;
  clearFilters: () => void;
  nextPage: (token?: string) => Promise<void>;
  previousPage: (token?: string) => Promise<void>;
  goToPage: (page: number, token?: string) => Promise<void>;

  // Admin actions
  createProject: (token: string, data: Partial<Project>) => Promise<boolean>;
  updateProject: (
    token: string,
    slug: string,
    data: Partial<Project>,
  ) => Promise<boolean>;
  deleteProject: (token: string, slug: string) => Promise<boolean>;

  // Helpers
  clearError: () => void;
  clearActiveProject: () => void;
}

const DEFAULT_FILTERS: ProjectFilters = {
  tag: null,
  featured: null,
  showAll: false,
};

const DEFAULT_PAGE_SIZE = 10;

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  activeProject: null,
  filters: DEFAULT_FILTERS,
  pagination: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  // ── Fetch projects (supports admin "showAll" mode + pagination) ────────────
  fetchProjects: async (token?, page = 1, limit = DEFAULT_PAGE_SIZE) => {
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

      const url = `/api/projects?${params.toString()}`;

      // Use authFetch if token provided (for admin "all" requests),
      // otherwise use regular fetch (for public requests)
      const res =
        filters.showAll && token
          ? await authFetch(token, url)
          : await fetch(url);

      const { data } = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to fetch projects");

      // Ensure we always set projects as an array
      set({
        projects: Array.isArray(data.data)
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
        projects: [], // Reset to empty array on error
        pagination: null,
      });
    }
  },

  // ── Fetch single project by slug ───────────────────────────────────────────
  fetchProjectBySlug: async (slug) => {
    set({ isLoading: true, error: null, activeProject: null });
    try {
      const res = await fetch(`/api/projects/${slug}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Project not found");

      // Handle both wrapped and unwrapped responses
      set({
        activeProject: data.data || data,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  // ── Filters ────────────────────────────────────────────────────────────────
  setFilter: (filters) => {
    const newFilters = { ...get().filters, ...filters };
    set({
      filters: newFilters,
      // Reset to first page when filters change
      pagination: null,
    });
    // Don't auto-fetch when changing to showAll since it needs auth
    if (!filters.showAll) {
      get().fetchProjects(
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
      projects: [], // Clear projects while refetching
    });
    get().fetchProjects(
      undefined,
      1,
      get().pagination?.limit || DEFAULT_PAGE_SIZE,
    );
  },

  // ── Pagination navigation ──────────────────────────────────────────────────
  nextPage: async (token?) => {
    const { pagination } = get();
    if (pagination?.hasNextPage) {
      await get().fetchProjects(token, pagination.page + 1, pagination.limit);
    }
  },

  previousPage: async (token?) => {
    const { pagination } = get();
    if (pagination?.hasPreviousPage) {
      await get().fetchProjects(token, pagination.page - 1, pagination.limit);
    }
  },

  goToPage: async (page, token?) => {
    const { pagination } = get();
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      await get().fetchProjects(
        token,
        page,
        pagination?.limit || DEFAULT_PAGE_SIZE,
      );
    }
  },

  // ── Admin: Create ──────────────────────────────────────────────────────────
  createProject: async (token, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, "/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create project");

      // After creating, refresh the current page
      const { pagination } = get();
      set({ isSubmitting: false });

      // Refresh current page to include new project
      await get().fetchProjects(
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
  updateProject: async (token, slug, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, `/api/projects/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update project");

      // Handle response data (might be wrapped or unwrapped)
      const updatedProject = json.data || json;

      // Update the project in the current list if it exists
      set((s) => ({
        projects: Array.isArray(s.projects)
          ? s.projects.map((p) => (p.slug === slug ? updatedProject : p))
          : [],
        activeProject:
          s.activeProject?.slug === slug ? updatedProject : s.activeProject,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  // ── Admin: Delete ──────────────────────────────────────────────────────────
  deleteProject: async (token, slug) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, `/api/projects/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Failed to delete project");
      }

      const { pagination, projects } = get();

      // Ensure projects is an array before filtering
      const currentProjects = Array.isArray(projects) ? projects : [];
      const updatedProjects = currentProjects.filter((p) => p.slug !== slug);

      // If we deleted the last item on the page and there are previous pages,
      // go to the previous page. Otherwise, just update the list.
      if (updatedProjects.length === 0 && pagination?.hasPreviousPage) {
        set({ isSubmitting: false });
        await get().fetchProjects(token, pagination.page - 1, pagination.limit);
      } else {
        set((s) => ({
          projects: updatedProjects,
          activeProject:
            s.activeProject?.slug === slug ? null : s.activeProject,
          isSubmitting: false,
        }));

        // Refresh to get accurate counts
        if (token) {
          await get().fetchProjects(
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
  clearActiveProject: () => set({ activeProject: null }),
}));

// ── Derived selectors ─────────────────────────────────────────────────────────
export const selectFeaturedProjects = (s: ProjectState) => {
  if (!Array.isArray(s.projects)) return [];
  return s.projects.filter((p) => p.featured);
};
export const selectPagination = (s: ProjectState) => s.pagination;

export const selectIsFirstPage = (s: ProjectState) =>
  !s.pagination?.hasPreviousPage;

export const selectIsLastPage = (s: ProjectState) => !s.pagination?.hasNextPage;

export const selectAllTags = (s: ProjectState) => {
  if (!Array.isArray(s.projects)) return [];
  return [...new Set(s.projects.flatMap((p) => p.tags || []))].sort();
};