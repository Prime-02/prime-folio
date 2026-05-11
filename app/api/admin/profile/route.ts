// app/api/admin/profile/route.ts
// GET   /api/admin/profile  — admin, full profile (including private fields)
// POST  /api/admin/profile  — admin, create profile (first-time setup)
// PATCH /api/admin/profile  — admin, update core profile fields

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import {
  UpdateProfileSchema,
  CreateProfileSchema,
} from "@/lib/validations/profile";
import { ok, created, conflict, notFound, serverError, validationError } from "@/lib/api-response";

const profileInclude = {
  skills:      { orderBy: [{ category: "asc" as const }, { order: "asc" as const }] },
  experiences: { orderBy: [{ current: "desc" as const }, { order: "asc" as const }] },
  educations:  { orderBy: [{ current: "desc" as const }, { order: "asc" as const }] },
  socialLinks: { orderBy: { order: "asc" as const } },
};

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const profile = await prisma.profile.findFirst({ include: profileInclude });
    if (!profile) return notFound("Profile");
    return ok(profile);
  } catch (e) {
    return serverError(e);
  }
}

// ── POST (first-time setup) ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const existing = await prisma.profile.findFirst();
    if (existing)
      return conflict("Profile already exists. Use PATCH to update.");

    const body = await req.json();

    // Use CreateProfileSchema instead of UpdateProfileSchema
    const parsed = CreateProfileSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const profile = await prisma.profile.create({
      data: parsed.data,
      include: profileInclude,
    });

    return created(profile);
  } catch (e) {
    return serverError(e);
  }
}
// ── PATCH ─────────────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) return notFound("Profile — create it first via POST /api/admin/profile");

    const body = await req.json();
    const parsed = UpdateProfileSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: parsed.data,
      include: profileInclude,
    });

    return ok(updated);
  } catch (e) {
    return serverError(e);
  }
}
