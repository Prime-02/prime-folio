// src/api/admin/testimonials/route.ts
// GET /api/admin/testimonials — admin only, list all (including pending) with pagination

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

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10)),
    );
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      ...(filter === "pending" && { approved: false }),
      ...(filter === "approved" && { approved: true }),
      // "all" or undefined returns everything (no filter)
    };

    // Execute both queries in parallel for better performance
    const [testimonials, totalCount] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          role: true,
          company: true,
          content: true,
          rating: true,
          avatar: true,
          approved: true,
          featured: true,
          createdAt: true,
          updatedAt: true,
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
