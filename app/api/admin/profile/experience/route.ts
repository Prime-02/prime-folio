// app/api/admin/profile/experience/route.ts
// GET  /api/admin/profile/experience
// POST /api/admin/profile/experience

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { CreateExperienceSchema } from "@/lib/validations/profile";
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

    const experiences = await prisma.experience.findMany({
      where: { profileId },
      orderBy: [{ current: "desc" }, { order: "asc" }, { startDate: "desc" }],
    });

    return ok(experiences);
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
    const parsed = CreateExperienceSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const experience = await prisma.experience.create({
      data: {
        ...parsed.data,
        profileId,
        startDate: new Date(parsed.data.startDate),
        endDate:   parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      },
    });

    return created(experience);
  } catch (e) {
    return serverError(e);
  }
}
