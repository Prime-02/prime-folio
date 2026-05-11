// src/lib/auth/session.ts
// Use inside API route handlers to verify the request is authenticated

import { type NextRequest } from "next/server";
import { extractBearerToken, verifyToken, type TokenPayload } from "./jwt";

export type AuthResult =
  | { ok: true; user: TokenPayload }
  | { ok: false; error: string };

export async function getSession(req: NextRequest): Promise<AuthResult> {
  const token = extractBearerToken(req.headers.get("authorization"));
  if (!token) return { ok: false, error: "Missing authorization token" };

  try {
    const user = await verifyToken(token);
    return { ok: true, user };
  } catch {
    return { ok: false, error: "Invalid or expired token" };
  }
}

// Convenience wrapper — returns 401 response when unauthenticated
export async function requireAuth(
  req: NextRequest,
): Promise<{ user: TokenPayload } | Response> {
  const result = await getSession(req);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 401 });
  }
  return { user: result.user };
}

// Optional auth — returns user if authenticated, null if not, never throws
export async function getOptionalAuth(
  req: NextRequest,
): Promise<{ user: TokenPayload } | null> {
  const result = await getSession(req);
  if (!result.ok) {
    return null;
  }
  return { user: result.user };
}
