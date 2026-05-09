// src/middleware.ts
// Runs at the Edge — intercepts all /api/admin/* requests (except login)
// and validates the JWT before the request reaches the route handler.

import { type NextRequest, NextResponse } from "next/server";
import { extractBearerToken, verifyToken } from "@/lib/auth/jwt";

const PUBLIC_ADMIN_ROUTES = ["/api/admin/auth/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only intercept admin API routes
  if (!pathname.startsWith("/api/admin")) return NextResponse.next();

  // Allow login through
  if (PUBLIC_ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const token = extractBearerToken(req.headers.get("authorization"));

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing authorization token" },
      { status: 401 }
    );
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
