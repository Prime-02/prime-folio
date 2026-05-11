// src/api/testimonials/route.ts
// GET  /api/testimonials  — public, returns approved testimonials with pagination
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

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10)),
    );
    const skip = (page - 1) * limit;

    // Build where clause - only approved for public
    const where = {
      approved: true,
      ...(featured === "true" && { featured: true }),
    };

    // Execute both queries in parallel for better performance
    const [testimonials, totalCount] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          role: true,
          company: true,
          avatar: true,
          content: true,
          rating: true,
          featured: true,
          createdAt: true,
        },
      }),
      prisma.testimonial.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return ok({
      data: testimonials,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
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
      select: {
        id: true,
        name: true,
        content: true,
        rating: true,
        createdAt: true,
      },
    });

    return created({
      ...testimonial,
      message:
        "Thank you! Your testimonial has been submitted and is pending review.",
    });
  } catch (e) {
    return serverError(e);
  }
}
