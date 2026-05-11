// lib/cloudinary/cloudinary.ts
// Server-side only — never import this in client components
// Dependency: npm install cloudinary

import { v2 as cloudinary } from "cloudinary";

// ── Configure once ────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// ── Upload folders — keeps your Cloudinary media library organised ────────────
export const FOLDERS = {
  profile: "prime-folio/profile",
  projects: "prime-folio/projects",
  blog: "prime-folio/blog",
  experience: "prime-folio/experience",
  education: "prime-folio/education",
  general: "prime-folio/general",
  skills: "prime-folio/skills",
  testimonials: "prime-folio/testimonials",
} as const;

export type UploadFolder = keyof typeof FOLDERS;

// ── Upload a file (base64 or URL) to Cloudinary ───────────────────────────────
export interface UploadOptions {
  folder: UploadFolder;
  publicId?: string; // custom public_id; auto-generated if omitted
  overwrite?: boolean;
  transformation?: Record<string, unknown>[];
}

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadFile(
  file: string, // base64 data URI or remote URL
  options: UploadOptions,
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(file, {
    folder: FOLDERS[options.folder],
    public_id: options.publicId,
    overwrite: options.overwrite ?? true,
    resource_type: "auto",
    transformation: options.transformation,
  });

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

// ── Delete a file by public_id ─────────────────────────────────────────────────
export async function deleteFile(publicId: string): Promise<boolean> {
  const result = await cloudinary.uploader.destroy(publicId);
  return result.result === "ok";
}

// ── Generate a signed upload signature (for client-side direct uploads) ───────
export interface SignatureResult {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export function generateSignature(
  folder: UploadFolder,
  publicId?: string,
): SignatureResult {
  const timestamp = Math.round(Date.now() / 1000);
  const folderPath = FOLDERS[folder];

  const params: Record<string, string | number> = {
    timestamp,
    folder: folderPath,
  };
  if (publicId) params.public_id = publicId;

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!,
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    folder: folderPath,
  };
}
