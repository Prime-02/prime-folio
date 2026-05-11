// app/api/admin/profile/social-links/route.ts
// GET  /api/admin/profile/social-links
// POST /api/admin/profile/social-links

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { CreateSocialLinkSchema } from "@/lib/validations/profile";
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

    const links = await prisma.socialLink.findMany({
      where: { profileId },
      orderBy: { order: "asc" },
    });

    return ok(links);
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
    const parsed = CreateSocialLinkSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const link = await prisma.socialLink.create({
      data: { ...parsed.data, profileId },
    });

    return created(link);
  } catch (e) {
    return serverError(e);
  }
}
