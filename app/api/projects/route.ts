// src/api/projects/route.ts
// GET  /api/projects        — public, returns published projects
//                           — admin with ?all=true returns all projects
//                           — supports pagination: ?page=1&limit=10
// POST /api/projects        — admin only, create project

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, getOptionalAuth } from "@/lib/auth/session";
import { CreateProjectSchema } from "@/lib/validations";
import {
  ok,
  created,
  conflict,
  serverError,
  validationError,
  unauthorized,
  badRequest,
} from "@/lib/api-response";

// ── GET /api/projects ─────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const tag = searchParams.get("tag");
    const showAll = searchParams.get("all");

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10)),
    );
    const skip = (page - 1) * limit;

    // Check if user wants all projects and is authenticated
    let publishedOnly = true;
    if (showAll === "true") {
      const authResult = await getOptionalAuth(req);
      if (!authResult) {
        return unauthorized("Authentication required to view all projects");
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
    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          tags: true,
          coverImage: true,
          liveUrl: true,
          repoUrl: true,
          featured: true,
          order: true,
          createdAt: true,
          published: true,
        },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return ok({
      data: projects,
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

// ── POST /api/projects ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const body = await req.json();
    const parsed = CreateProjectSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const existing = await prisma.project.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing)
      return conflict(`Slug "${parsed.data.slug}" is already in use`);

    const project = await prisma.project.create({ data: parsed.data });
    return created(project);
  } catch (e) {
    return serverError(e);
  }
}
