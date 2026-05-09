// src/lib/api-response.ts
// Consistent response shapes across all routes

import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return ok(data, 201);
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status: 400 });
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

export function notFound(resource = "Resource") {
  return NextResponse.json({ success: false, error: `${resource} not found` }, { status: 404 });
}

export function conflict(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 409 });
}

export function serverError(error: unknown) {
  console.error("[API Error]", error);
  return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
}

// Handles Zod parse errors uniformly
export function validationError(error: ZodError) {
  return badRequest("Validation failed", error.flatten().fieldErrors);
}
