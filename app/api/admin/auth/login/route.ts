// src/api/admin/auth/login/route.ts
// POST /api/admin/auth/login

import { type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { signToken } from "@/lib/auth/jwt";
import { LoginSchema } from "@/lib/validations";
import { ok, badRequest, unauthorized, serverError, validationError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return unauthorized("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return unauthorized("Invalid credentials");

    const token = await signToken({ userId: user.id, email: user.email });

    return ok({ token, email: user.email });
  } catch (e) {
    return serverError(e);
  }
}
