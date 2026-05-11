// src/api/admin/contact/[id]/route.ts
// PATCH  /api/admin/contact/:id  — update status (READ, REPLIED, ARCHIVED)
// DELETE /api/admin/contact/:id  — delete message

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { UpdateContactStatusSchema } from "@/lib/validations";
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
    const parsed = UpdateContactStatusSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    // Await params before accessing its properties
    const { id } = await params;

    const msg = await prisma.contactMessage.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return ok(msg);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Message");
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

    await prisma.contactMessage.delete({ where: { id } });
    return noContent();
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Message");
    return serverError(e);
  }
}
