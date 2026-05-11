// app/api/admin/profile/skills/route.ts
// GET  /api/admin/profile/skills  — list all skills
// POST /api/admin/profile/skills  — add a skill

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { CreateSkillSchema } from "@/lib/validations/profile";
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

    const skills = await prisma.skill.findMany({
      where: { profileId },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    return ok(skills);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const profileId = await getProfileId();
    if (!profileId) return notFound("Profile — create your profile first");

    const body = await req.json();
    const parsed = CreateSkillSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const skill = await prisma.skill.create({
      data: { ...parsed.data, profileId },
    });

    return created(skill);
  } catch (e) {
    return serverError(e);
  }
}
