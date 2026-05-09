// src/api/projects/route.ts
// GET  /api/projects        — public, returns published projects
// POST /api/projects        — admin only, create project

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { CreateProjectSchema } from "@/lib/validations";
import {
  ok, created, badRequest, conflict, serverError, validationError,
} from "@/lib/api-response";

// ── GET /api/projects ─────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const tag      = searchParams.get("tag");

    const projects = await prisma.project.findMany({
      where: {
        published: true,
        ...(featured === "true" && { featured: true }),
        ...(tag && { tags: { has: tag } }),
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true, title: true, slug: true, summary: true,
        tags: true, coverImage: true, liveUrl: true, repoUrl: true,
        featured: true, order: true, createdAt: true,
      },
    });

    return ok(projects);
  } catch (e) {
    return serverError(e);
  }
}

// ── POST /api/projects ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const body = await req.json();
    const parsed = CreateProjectSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return conflict(`Slug "${parsed.data.slug}" is already in use`);

    const project = await prisma.project.create({ data: parsed.data });
    return created(project);
  } catch (e) {
    return serverError(e);
  }
}
