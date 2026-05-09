// src/api/admin/stats/route.ts
// GET /api/admin/stats — admin dashboard summary counts

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { ok, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const [
      totalProjects,
      publishedProjects,
      totalPosts,
      publishedPosts,
      totalTestimonials,
      pendingTestimonials,
      unreadMessages,
      totalMessages,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { approved: false } }),
      prisma.contactMessage.count({ where: { status: "UNREAD" } }),
      prisma.contactMessage.count(),
    ]);

    return ok({
      projects:     { total: totalProjects, published: publishedProjects },
      posts:        { total: totalPosts, published: publishedPosts },
      testimonials: { total: totalTestimonials, pending: pendingTestimonials },
      messages:     { total: totalMessages, unread: unreadMessages },
    });
  } catch (e) {
    return serverError(e);
  }
}
