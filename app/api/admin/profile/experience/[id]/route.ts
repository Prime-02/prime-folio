// app/api/admin/profile/experience/[id]/route.ts
// PATCH  /api/admin/profile/experience/:id
// DELETE /api/admin/profile/experience/:id

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { UpdateExperienceSchema } from "@/lib/validations/profile";
import {
  ok,
  noContent,
  notFound,
  serverError,
  validationError,
} from "@/lib/api-response";

// Remove the old Params type
// type Params = { params: { id: string } };

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const body = await req.json();
    const parsed = UpdateExperienceSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    // Await params before accessing its properties
    const { id } = await params;

    const data: any = { ...parsed.data };
    if (parsed.data.startDate) data.startDate = new Date(parsed.data.startDate);
    if (parsed.data.endDate) data.endDate = new Date(parsed.data.endDate);
    if (parsed.data.endDate === null) data.endDate = null;

    const experience = await prisma.experience.update({
      where: { id },
      data,
    });
    return ok(experience);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Experience");
    return serverError(e);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    // Await params before accessing its properties
    const { id } = await params;

    await prisma.experience.delete({ where: { id } });
    return noContent();
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Experience");
    return serverError(e);
  }
}
