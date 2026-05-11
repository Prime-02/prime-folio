// src/lib/validations/index.ts
// Shared Zod schemas used by both API routes and server actions

import { z } from "zod";

// ── Project ───────────────────────────────────────────────────────────────────
export const CreateProjectSchema = z.object({
  title:       z.string().min(1).max(120),
  slug:        z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  summary:     z.string().min(1).max(300),
  description: z.string().min(1),
  tags:        z.array(z.string()).default([]),
  coverImage:  z.string().optional(),
  liveUrl:     z.string().url().optional().or(z.literal("")),
  repoUrl:     z.string().url().optional().or(z.literal("")),
  featured:    z.boolean().default(false),
  published:   z.boolean().default(false),
  order:       z.number().int().default(0),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(160),
  slug: z
    .string()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9-]+$/),
  summary: z.string().min(1).max(400),
  content: z.string().min(1), // <-- add this
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
});

export const UpdatePostSchema = CreatePostSchema.partial();

// ── Testimonial (visitor submission) ─────────────────────────────────────────
export const CreateTestimonialSchema = z.object({
  name:    z.string().min(1).max(100),
  role:    z.string().max(120).optional(),
  company: z.string().max(120).optional(),
  avatar:  z.string().optional(), // Cloudinary public_id after upload
  content: z.string().min(10).max(1000),
  rating:  z.number().int().min(1).max(5).default(5),
});

export const UpdateTestimonialSchema = z.object({
  approved: z.boolean().optional(),
  featured: z.boolean().optional(),
});

// ── Contact message ───────────────────────────────────────────────────────────
export const CreateContactSchema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
});

export const UpdateContactStatusSchema = z.object({
  status: z.enum(["UNREAD", "READ", "REPLIED", "ARCHIVED"]),
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});
