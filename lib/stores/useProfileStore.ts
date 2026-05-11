// lib/stores/useProfileStore.ts
// Manages the full profile — core info, skills, experience, education, social links

import { create } from "zustand";
import { useShallow } from 'zustand/react/shallow';
import { authFetch } from "./useAuthStore";
import type {
  Profile,
  Skill,
  Experience,
  Education,
  SocialLink,
} from "@/lib/types";

export type FullProfile = Profile & {
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  socialLinks: SocialLink[];
};

interface ProfileState {
  // Data
  profile: FullProfile | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Public
  fetchProfile: () => Promise<void>;

  // Admin — core profile
  createProfile: (token: string, data: Partial<Profile>) => Promise<boolean>;
  updateProfile: (token: string, data: Partial<Profile>) => Promise<boolean>;

  // Admin — skills
  addSkill: (token: string, data: Partial<Skill>) => Promise<boolean>;
  updateSkill: (
    token: string,
    id: string,
    data: Partial<Skill>,
  ) => Promise<boolean>;
  deleteSkill: (token: string, id: string) => Promise<boolean>;

  // Admin — experience
  addExperience: (token: string, data: Partial<Experience>) => Promise<boolean>;
  updateExperience: (
    token: string,
    id: string,
    data: Partial<Experience>,
  ) => Promise<boolean>;
  deleteExperience: (token: string, id: string) => Promise<boolean>;

  // Admin — education
  addEducation: (token: string, data: Partial<Education>) => Promise<boolean>;
  updateEducation: (
    token: string,
    id: string,
    data: Partial<Education>,
  ) => Promise<boolean>;
  deleteEducation: (token: string, id: string) => Promise<boolean>;

  // Admin — social links
  addSocialLink: (token: string, data: Partial<SocialLink>) => Promise<boolean>;
  updateSocialLink: (
    token: string,
    id: string,
    data: Partial<SocialLink>,
  ) => Promise<boolean>;
  deleteSocialLink: (token: string, id: string) => Promise<boolean>;

  clearError: () => void;
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
  profile: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  // ── Public: fetch full profile ─────────────────────────────────────────────
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch profile");
      set({ profile: data.data, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  // ── Admin: create profile (first-time setup) ───────────────────────────────
  createProfile: async (token, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, "/api/admin/profile", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        // Format validation errors nicely
        if (json.details) {
          const fieldErrors = Object.entries(json.details)
            .map(
              ([field, errors]) =>
                `${field}: ${(errors as string[]).join(", ")}`,
            )
            .join("; ");
          throw new Error(fieldErrors);
        }
        throw new Error(json.error ?? "Failed to create profile");
      }

      set({ profile: json.data, isSubmitting: false });
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  // ── Admin: update core profile fields ─────────────────────────────────────
  updateProfile: async (token, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, "/api/admin/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update profile");
      set({ profile: json.data, isSubmitting: false });
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  // ── Skills ─────────────────────────────────────────────────────────────────
  addSkill: async (token, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, "/api/admin/profile/skills", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to add skill");
      set((s) => ({
        profile: s.profile
          ? { ...s.profile, skills: [...s.profile.skills, json.data] }
          : s.profile,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  updateSkill: async (token, id, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, `/api/admin/profile/skills/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update skill");
      set((s) => ({
        profile: s.profile
          ? {
              ...s.profile,
              skills: s.profile.skills.map((sk) =>
                sk.id === id ? json.data : sk,
              ),
            }
          : s.profile,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  deleteSkill: async (token, id) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, `/api/admin/profile/skills/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error);
      }
      set((s) => ({
        profile: s.profile
          ? {
              ...s.profile,
              skills: s.profile.skills.filter((sk) => sk.id !== id),
            }
          : s.profile,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  // ── Experience ─────────────────────────────────────────────────────────────
  addExperience: async (token, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, "/api/admin/profile/experience", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to add experience");
      set((s) => ({
        profile: s.profile
          ? { ...s.profile, experiences: [json.data, ...s.profile.experiences] }
          : s.profile,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  updateExperience: async (token, id, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(
        token,
        `/api/admin/profile/experience/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update experience");
      set((s) => ({
        profile: s.profile
          ? {
              ...s.profile,
              experiences: s.profile.experiences.map((ex) =>
                ex.id === id ? json.data : ex,
              ),
            }
          : s.profile,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  deleteExperience: async (token, id) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(
        token,
        `/api/admin/profile/experience/${id}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error);
      }
      set((s) => ({
        profile: s.profile
          ? {
              ...s.profile,
              experiences: s.profile.experiences.filter((ex) => ex.id !== id),
            }
          : s.profile,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  // ── Education ──────────────────────────────────────────────────────────────
  addEducation: async (token, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, "/api/admin/profile/education", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to add education");
      set((s) => ({
        profile: s.profile
          ? { ...s.profile, educations: [json.data, ...s.profile.educations] }
          : s.profile,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  updateEducation: async (token, id, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, `/api/admin/profile/education/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update education");
      set((s) => ({
        profile: s.profile
          ? {
              ...s.profile,
              educations: s.profile.educations.map((ed) =>
                ed.id === id ? json.data : ed,
              ),
            }
          : s.profile,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  deleteEducation: async (token, id) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, `/api/admin/profile/education/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error);
      }
      set((s) => ({
        profile: s.profile
          ? {
              ...s.profile,
              educations: s.profile.educations.filter((ed) => ed.id !== id),
            }
          : s.profile,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  // ── Social Links ───────────────────────────────────────────────────────────
  addSocialLink: async (token, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(token, "/api/admin/profile/social-links", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to add social link");
      set((s) => ({
        profile: s.profile
          ? { ...s.profile, socialLinks: [...s.profile.socialLinks, json.data] }
          : s.profile,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  updateSocialLink: async (token, id, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(
        token,
        `/api/admin/profile/social-links/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
      );
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error ?? "Failed to update social link");
      set((s) => ({
        profile: s.profile
          ? {
              ...s.profile,
              socialLinks: s.profile.socialLinks.map((sl) =>
                sl.id === id ? json.data : sl,
              ),
            }
          : s.profile,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  deleteSocialLink: async (token, id) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await authFetch(
        token,
        `/api/admin/profile/social-links/${id}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error);
      }
      set((s) => ({
        profile: s.profile
          ? {
              ...s.profile,
              socialLinks: s.profile.socialLinks.filter((sl) => sl.id !== id),
            }
          : s.profile,
        isSubmitting: false,
      }));
      return true;
    } catch (e: any) {
      set({ error: e.message, isSubmitting: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectSkillsByCategory = (s: ProfileState) => {
  if (!s.profile) return {};
  return s.profile.skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
};

export const selectCurrentJob = (s: ProfileState) =>
  s.profile?.experiences.find((e) => e.current) ?? null;

export const selectIsAvailable = (s: ProfileState) =>
  s.profile?.availableForWork ?? false;

export const useSkillsByCategory = () => {
  return useProfileStore(useShallow(selectSkillsByCategory));
};