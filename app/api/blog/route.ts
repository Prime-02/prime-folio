// src/api/blog/route.ts
// GET  /api/blog   — public, returns published post metadata with pagination
// POST /api/blog   — admin only, register MDX post metadata

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, getOptionalAuth } from "@/lib/auth/session";
import { CreatePostSchema } from "@/lib/validations";
import {
  ok,
  created,
  conflict,
  serverError,
  validationError,
  unauthorized,
} from "@/lib/api-response";

// ── GET /api/blog ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const featured = searchParams.get("featured");
    const showAll = searchParams.get("all");

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10)),
    );
    const skip = (page - 1) * limit;

    // Check if user wants all posts and is authenticated
    let publishedOnly = true;
    if (showAll === "true") {
      const authResult = await getOptionalAuth(req);
      if (!authResult) {
        return unauthorized("Authentication required to view all posts");
      }
      publishedOnly = false;
    }

    // Build where clause
    const where = {
      ...(publishedOnly && { published: true }),
      ...(featured === "true" && { featured: true }),
      ...(tag && { tags: { has: tag } }),
    };

    // Execute both queries in parallel for better performance
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          tags: true,
          coverImage: true,
          featured: true,
          published: true, // admin needs it
          publishedAt: true,
          createdAt: true,
          // note: content intentionally omitted from list view
        },
      }),
      prisma.post.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return ok({
      data: posts,
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

// ── POST /api/blog ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const body = await req.json();
    const parsed = CreatePostSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const existing = await prisma.post.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing)
      return conflict(`Slug "${parsed.data.slug}" is already registered`);

    const post = await prisma.post.create({
      data: {
        ...parsed.data,
        publishedAt: parsed.data.published
          ? parsed.data.publishedAt
            ? new Date(parsed.data.publishedAt)
            : new Date()
          : null,
      },
    });
    return created(post);
  } catch (e) {
    return serverError(e);
  }
}
