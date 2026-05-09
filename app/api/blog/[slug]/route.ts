// src/api/blog/[slug]/route.ts
// GET    /api/blog/:slug  — public (metadata only; MDX content loaded separately on frontend)
// PATCH  /api/blog/:slug  — admin only
// DELETE /api/blog/:slug  — admin only

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { UpdatePostSchema } from "@/lib/validations";
import {
  ok, noContent, notFound, conflict, serverError, validationError,
} from "@/lib/api-response";

type Params = { params: { slug: string } };

// ── GET /api/blog/:slug ───────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug, published: true },
    });
    if (!post) return notFound("Post");
    return ok(post);
  } catch (e) {
    return serverError(e);
  }
}

// ── PATCH /api/blog/:slug ─────────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const body = await req.json();
    const parsed = UpdatePostSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    if (parsed.data.slug) {
      const collision = await prisma.post.findFirst({
        where: { slug: parsed.data.slug, NOT: { slug: params.slug } },
      });
      if (collision) return conflict(`Slug "${parsed.data.slug}" is already in use`);
    }

    // Auto-set publishedAt when toggling published → true
    const updateData: any = { ...parsed.data };
    if (parsed.data.published === true && !parsed.data.publishedAt) {
      const current = await prisma.post.findUnique({ where: { slug: params.slug } });
      if (!current?.publishedAt) updateData.publishedAt = new Date();
    }
    if (parsed.data.published === false) {
      updateData.publishedAt = null;
    }

    const post = await prisma.post.update({
      where: { slug: params.slug },
      data: updateData,
    });
    return ok(post);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Post");
    return serverError(e);
  }
}

// ── DELETE /api/blog/:slug ────────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    await prisma.post.delete({ where: { slug: params.slug } });
    return noContent();
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Post");
    return serverError(e);
  }
}
