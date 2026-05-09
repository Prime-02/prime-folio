// src/api/testimonials/route.ts
// GET  /api/testimonials  — public, returns approved testimonials
// POST /api/testimonials  — public, visitor submission (pending approval)

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { CreateTestimonialSchema } from "@/lib/validations";
import { ok, created, serverError, validationError } from "@/lib/api-response";

// ── GET /api/testimonials ─────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");

    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: true,
        ...(featured === "true" && { featured: true }),
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      select: {
        id: true, name: true, role: true, company: true,
        avatar: true, content: true, rating: true,
        featured: true, createdAt: true,
      },
    });

    return ok(testimonials);
  } catch (e) {
    return serverError(e);
  }
}

// ── POST /api/testimonials ────────────────────────────────────────────────────
// Visitors submit testimonials; they are pending (approved: false) by default.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateTestimonialSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const testimonial = await prisma.testimonial.create({
      data: { ...parsed.data, approved: false },
      select: { id: true, name: true, content: true, rating: true, createdAt: true },
    });

    return created({
      ...testimonial,
      message: "Thank you! Your testimonial has been submitted and is pending review.",
    });
  } catch (e) {
    return serverError(e);
  }
}
