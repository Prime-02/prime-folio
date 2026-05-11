// src/api/projects/[slug]/route.ts
// GET    /api/projects/:slug  — public
// PATCH  /api/projects/:slug  — admin only
// DELETE /api/projects/:slug  — admin only

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { UpdateProjectSchema } from "@/lib/validations";
import {
  ok,
  noContent,
  notFound,
  conflict,
  serverError,
  validationError,
} from "@/lib/api-response";

// Remove the old Params type
// type Params = { params: { slug: string } };

// ── GET /api/projects/:slug ───────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const project = await prisma.project.findUnique({
      where: { slug },
    });
    if (!project) return notFound("Project");
    return ok(project);
  } catch (e) {
    return serverError(e);
  }
}

// ── PATCH /api/projects/:slug ─────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const { slug } = await params;
    const body = await req.json();
    const parsed = UpdateProjectSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    // Slug uniqueness check (only when slug is being changed)
    if (parsed.data.slug) {
      const collision = await prisma.project.findFirst({
        where: { slug: parsed.data.slug, NOT: { slug } },
      });
      if (collision)
        return conflict(`Slug "${parsed.data.slug}" is already in use`);
    }

    const project = await prisma.project.update({
      where: { slug },
      data: parsed.data,
    });
    return ok(project);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Project");
    return serverError(e);
  }
}

// ── DELETE /api/projects/:slug ────────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const { slug } = await params;

    await prisma.project.delete({ where: { slug } });
    return noContent();
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Project");
    return serverError(e);
  }
}
