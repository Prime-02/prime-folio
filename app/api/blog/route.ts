// src/api/blog/route.ts
// GET  /api/blog   — public, returns published post metadata
// POST /api/blog   — admin only, register MDX post metadata

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { CreatePostSchema } from "@/lib/validations";
import {
  ok, created, conflict, serverError, validationError,
} from "@/lib/api-response";

// ── GET /api/blog ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tag      = searchParams.get("tag");
    const featured = searchParams.get("featured");
    const limit    = Number(searchParams.get("limit")) || undefined;

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        ...(featured === "true" && { featured: true }),
        ...(tag && { tags: { has: tag } }),
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: {
        id: true, title: true, slug: true, summary: true, tags: true,
        coverImage: true, featured: true, publishedAt: true, createdAt: true,
      },
    });

    return ok(posts);
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

    const existing = await prisma.post.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return conflict(`Slug "${parsed.data.slug}" is already registered`);

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
