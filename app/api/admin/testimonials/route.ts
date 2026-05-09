// src/api/admin/testimonials/route.ts
// GET /api/admin/testimonials — admin only, list all (including pending)

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { ok, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // "pending" | "approved" | "all"

    const testimonials = await prisma.testimonial.findMany({
      where: {
        ...(filter === "pending"  && { approved: false }),
        ...(filter === "approved" && { approved: true }),
      },
      orderBy: { createdAt: "desc" },
    });

    return ok(testimonials);
  } catch (e) {
    return serverError(e);
  }
}
