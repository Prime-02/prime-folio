// app/api/admin/profile/skills/[id]/route.ts

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { UpdateSkillSchema } from "@/lib/validations/profile";
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
  { params }: { params: Promise<{ id: string }> }, // params is now a Promise
) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const body = await req.json();
    const parsed = UpdateSkillSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    // Await params before accessing its properties
    const { id } = await params;

    const skill = await prisma.skill.update({
      where: { id },
      data: parsed.data,
    });
    return ok(skill);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Skill");
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

    await prisma.skill.delete({ where: { id } });
    return noContent();
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Skill");
    return serverError(e);
  }
}
