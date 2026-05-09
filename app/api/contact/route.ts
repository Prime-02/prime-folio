// src/api/contact/route.ts
// POST /api/contact — public, visitor submits contact message

import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { CreateContactSchema } from "@/lib/validations";
import { created, serverError, validationError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateContactSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const message = await prisma.contactMessage.create({
      data: parsed.data,
      select: { id: true, name: true, email: true, createdAt: true },
    });

    // TODO: wire up email notification (Resend / Nodemailer)
    // await sendEmailNotification(parsed.data);

    return created({
      ...message,
      message: "Message received! I'll get back to you as soon as possible.",
    });
  } catch (e) {
    return serverError(e);
  }
}
