// lib/validations/profile.ts
// Zod schemas for Profile, Skill, Experience, Education, SocialLink

import { z } from "zod";

// ── Profile ───────────────────────────────────────────────────────────────────
export const UpdateProfileSchema = z.object({
  name:             z.string().min(1).max(100).optional(),
  headline:         z.string().min(1).max(160).optional(),
  tagline:          z.string().min(1).max(300).optional(),
  bio:              z.string().min(1).optional(),
  profilePhoto:     z.string().optional().nullable(),
  coverPhoto:       z.string().optional().nullable(),
  resumeUrl:        z.string().optional().nullable(),
  resumeLabel:      z.string().max(60).optional().nullable(),
  availableForWork: z.boolean().optional(),
  availabilityNote: z.string().max(200).optional().nullable(),
  city:             z.string().max(100).optional().nullable(),
  state:            z.string().max(100).optional().nullable(),
  country:          z.string().max(100).optional().nullable(),
  addressLine:      z.string().max(200).optional().nullable(),
  timezone:         z.string().max(60).optional().nullable(),
});


export const CreateProfileSchema = z.object({
  // Required fields
  name:             z.string().min(1).max(100),
  headline:         z.string().min(1).max(160),
  tagline:          z.string().min(1).max(300),
  bio:              z.string().min(1),
  
  // Optional fields (same as UpdateProfileSchema)
  profilePhoto:     z.string().optional().nullable(),
  coverPhoto:       z.string().optional().nullable(),
  resumeUrl:        z.string().optional().nullable(),
  resumeLabel:      z.string().max(60).optional().nullable(),
  availableForWork: z.boolean().optional().default(true),
  availabilityNote: z.string().max(200).optional().nullable(),
  city:             z.string().max(100).optional().nullable(),
  state:            z.string().max(100).optional().nullable(),
  country:          z.string().max(100).optional().nullable(),
  addressLine:      z.string().max(200).optional().nullable(),
  timezone:         z.string().max(60).optional().nullable(),
});

// ── Skill ─────────────────────────────────────────────────────────────────────
export const CreateSkillSchema = z.object({
  name:        z.string().min(1).max(80),
  category:    z.string().min(1).max(80),
  proficiency: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).default("INTERMEDIATE"),
  icon:        z.string().optional(),
  order:       z.number().int().default(0),
});

export const UpdateSkillSchema = CreateSkillSchema.partial();

// ── Experience ────────────────────────────────────────────────────────────────
export const CreateExperienceSchema = z.object({
  company:     z.string().min(1).max(120),
  role:        z.string().min(1).max(120),
  description: z.string().optional(),
  location:    z.string().max(120).optional(),
  companyUrl:  z.string().url().optional().or(z.literal("")),
  companyLogo: z.string().optional(),
  startDate:   z.string().datetime(),
  endDate:     z.string().datetime().optional().nullable(),
  current:     z.boolean().default(false),
  order:       z.number().int().default(0),
});

export const UpdateExperienceSchema = CreateExperienceSchema.partial();

// ── Education ─────────────────────────────────────────────────────────────────
export const CreateEducationSchema = z.object({
  institution: z.string().min(1).max(160),
  degree:      z.string().min(1).max(160),
  field:       z.string().max(120).optional(),
  description: z.string().optional(),
  logo:        z.string().optional(),
  startYear:   z.number().int().min(1950).max(2100),
  endYear:     z.number().int().min(1950).max(2100).optional().nullable(),
  current:     z.boolean().default(false),
  order:       z.number().int().default(0),
});

export const UpdateEducationSchema = CreateEducationSchema.partial();

// ── Social Link ───────────────────────────────────────────────────────────────
export const CreateSocialLinkSchema = z.object({
  platform: z.string().min(1).max(60),
  url:      z.string().url(),
  icon:     z.string().optional(),
  order:    z.number().int().default(0),
});

export const UpdateSocialLinkSchema = CreateSocialLinkSchema.partial();
