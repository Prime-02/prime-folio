// app/api/admin/upload/route.ts
// POST /api/admin/upload?action=sign    — returns a signed signature for direct browser upload
// POST /api/admin/upload?action=server  — uploads a base64 file server-side via Cloudinary SDK
// DELETE /api/admin/upload              — deletes a file by public_id

import { type NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import {
  generateSignature,
  uploadFile,
  deleteFile,
  type UploadFolder,
} from "@/lib/cloudinary";
import { ok, badRequest, serverError } from "@/lib/api-response";

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") ?? "sign"; // "sign" | "server"
    const body = await req.json();

    // ── Action: sign — generate signature for client-side direct upload ───────
    if (action === "sign") {
      const { folder, publicId } = body as {
        folder: UploadFolder;
        publicId?: string;
      };

      if (!folder) return badRequest("folder is required");

      const signature = generateSignature(folder, publicId);
      return ok(signature);
    }

    // ── Action: server — upload base64 file server-side ───────────────────────
    if (action === "server") {
      const { file, folder, publicId } = body as {
        file: string; // base64 data URI
        folder: UploadFolder;
        publicId?: string;
      };

      if (!file) return badRequest("file is required");
      if (!folder) return badRequest("folder is required");

      const result = await uploadFile(file, { folder, publicId });
      return ok(result);
    }

    return badRequest(`Unknown action "${action}". Use "sign" or "server".`);
  } catch (e) {
    return serverError(e);
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const body = await req.json();
    const { publicId } = body as { publicId: string };

    if (!publicId) return badRequest("publicId is required");

    const deleted = await deleteFile(publicId);
    if (!deleted) return badRequest("File not found or already deleted");

    return ok({ deleted: true, publicId });
  } catch (e) {
    return serverError(e);
  }
}
