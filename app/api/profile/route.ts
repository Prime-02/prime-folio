// app/api/profile/route.ts
// GET /api/profile — public, returns the full profile with all relations

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ok, notFound, serverError } from "@/lib/api-response";

export async function GET(_req: NextRequest) {
  try {
    const profile = await prisma.profile.findFirst({
      include: {
        skills: { orderBy: [{ category: "asc" }, { order: "asc" }] },
        experiences: {
          orderBy: [
            { current: "desc" },
            { order: "asc" },
            { startDate: "desc" },
          ],
        },
        educations: {
          orderBy: [
            { current: "desc" },
            { order: "asc" },
            { startYear: "desc" },
          ],
        },
        socialLinks: { orderBy: { order: "asc" } },
      },
    });

    if (!profile) return notFound("Profile");
    return ok(profile);
  } catch (e) {
    return serverError(e);
  }
}
