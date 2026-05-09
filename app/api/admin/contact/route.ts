// src/api/admin/contact/route.ts
// GET /api/admin/contact — admin only, list messages

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { ok, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // UNREAD | READ | REPLIED | ARCHIVED

    const messages = await prisma.contactMessage.findMany({
      where: {
        ...(status && { status: status as any }),
      },
      orderBy: { createdAt: "desc" },
    });

    return ok(messages);
  } catch (e) {
    return serverError(e);
  }
}
