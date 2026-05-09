// src/lib/auth/jwt.ts
// Dependency: npm install jose bcryptjs
// jose is used because it works in the Next.js Edge runtime (middleware)

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
}

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? (() => { throw new Error("JWT_SECRET is not set"); })()
);

const EXPIRY = "8h";

// ── Sign ──────────────────────────────────────────────────────────────────────
export async function signToken(payload: Omit<TokenPayload, keyof JWTPayload>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(secret);
}

// ── Verify ────────────────────────────────────────────────────────────────────
export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as TokenPayload;
}

// ── Extract from request header ───────────────────────────────────────────────
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
