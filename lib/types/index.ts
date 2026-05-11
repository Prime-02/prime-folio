// src/types/index.ts
// Shared TypeScript types across the application

import type {
  Project,
  Post,
  Testimonial,
  ContactMessage,
  MessageStatus,
  Profile,
  Skill,
  Experience,
  Education,
  SocialLink,
} from "@prisma/client";

// ── Re-exports from Prisma ────────────────────────────────────────────────────
export type {
  Project,
  Post,
  Testimonial,
  ContactMessage,
  MessageStatus,
  Profile,
  Skill,
  Experience,
  Education,
  SocialLink,
};

// ── API response envelope ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

// ── Public-facing shapes (subset of DB models) ────────────────────────────────
export type ProjectCard = Pick<
  Project,
  | "id"
  | "title"
  | "slug"
  | "summary"
  | "tags"
  | "coverImage"
  | "liveUrl"
  | "repoUrl"
  | "featured"
  | "order"
  | "createdAt"
>;

export type PostCard = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "summary"
  | "tags"
  | "coverImage"
  | "featured"
  | "publishedAt"
  | "createdAt"
>;

export type PublicTestimonial = Pick<
  Testimonial,
  | "id"
  | "name"
  | "role"
  | "company"
  | "avatar"
  | "content"
  | "rating"
  | "featured"
  | "createdAt"
>;

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthToken {
  token: string;
  email: string;
}

// ── Dashboard stats ───────────────────────────────────────────────────────────
export interface DashboardStats {
  projects: { total: number; published: number };
  posts: { total: number; published: number };
  testimonials: { total: number; pending: number };
  messages: { total: number; unread: number };
}
