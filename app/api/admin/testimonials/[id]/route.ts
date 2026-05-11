// src/api/admin/testimonials/[id]/route.ts
// PATCH  /api/admin/testimonials/:id  — approve, feature, etc.
// DELETE /api/admin/testimonials/:id  — delete

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { UpdateTestimonialSchema } from "@/lib/validations";
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
    const parsed = UpdateTestimonialSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    // Await params before accessing its properties
    const { id } = await params;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: parsed.data,
    });
    return ok(testimonial);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Testimonial");
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

    await prisma.testimonial.delete({ where: { id } });
    return noContent();
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Testimonial");
    return serverError(e);
  }
}
