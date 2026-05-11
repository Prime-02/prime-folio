// app/api/admin/profile/education/route.ts
// GET  /api/admin/profile/education
// POST /api/admin/profile/education

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { CreateEducationSchema } from "@/lib/validations/profile";
import { ok, created, notFound, serverError, validationError } from "@/lib/api-response";

async function getProfileId(): Promise<string | null> {
  const profile = await prisma.profile.findFirst({ select: { id: true } });
  return profile?.id ?? null;
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const profileId = await getProfileId();
    if (!profileId) return notFound("Profile");

    const educations = await prisma.education.findMany({
      where: { profileId },
      orderBy: [{ current: "desc" }, { order: "asc" }, { startYear: "desc" }],
    });

    return ok(educations);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const profileId = await getProfileId();
    if (!profileId) return notFound("Profile");

    const body = await req.json();
    const parsed = CreateEducationSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const education = await prisma.education.create({
      data: { ...parsed.data, profileId },
    });

    return created(education);
  } catch (e) {
    return serverError(e);
  }
}
