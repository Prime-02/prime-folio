// lib/stores/useUploadStore.ts
// Manages Cloudinary upload state — supports multiple concurrent uploads
// Uses signed direct upload (browser → Cloudinary) for large files
// Falls back to server-side upload for small files / base64

import { create } from "zustand";
import type { UploadFolder, SignatureResult } from "@/lib/cloudinary";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadState {
  status: UploadStatus;
  progress: number; // 0–100
  publicId: string | null; // Cloudinary public_id on success
  url: string | null; // secure URL on success
  error: string | null;
}

const DEFAULT_UPLOAD_STATE: UploadState = {
  status: "idle",
  progress: 0,
  publicId: null,
  url: null,
  error: null,
};

interface UploadStoreState {
  // Keyed by a field name so multiple uploads can run concurrently
  // e.g. "profilePhoto", "coverPhoto", "project-my-project", etc.
  uploads: Record<string, UploadState>;

  // Actions
  uploadFile: (
    token: string,
    key: string, // unique key for this upload slot
    file: File,
    folder: UploadFolder,
    publicId?: string,
  ) => Promise<string | null>; // returns publicId on success, null on failure

  deleteFile: (token: string, publicId: string) => Promise<boolean>;

  resetUpload: (key: string) => void;
  resetAll: () => void;
  getUpload: (key: string) => UploadState;
}

export const useUploadStore = create<UploadStoreState>()((set, get) => ({
  uploads: {},

  // ── Upload a file via signed direct upload (browser → Cloudinary) ──────────
  uploadFile: async (token, key, file, folder, publicId) => {
    // Initialise slot
    set((s) => ({
      uploads: {
        ...s.uploads,
        [key]: { ...DEFAULT_UPLOAD_STATE, status: "uploading", progress: 0 },
      },
    }));

    try {
      // Step 1 — Get signature from our API
      const sigRes = await fetch("/api/admin/upload?action=sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folder, publicId }),
      });

      if (!sigRes.ok) {
        const err = await sigRes.json();
        throw new Error(err.error ?? "Failed to get upload signature");
      }

      const sig: { data: SignatureResult } = await sigRes.json();
      const {
        signature,
        timestamp,
        apiKey,
        cloudName,
        folder: folderPath,
      } = sig.data;

      // Step 2 — Upload directly to Cloudinary with XHR so we get progress
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folderPath);
      if (publicId) formData.append("public_id", publicId);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const result = await new Promise<{
        public_id: string;
        secure_url: string;
      }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            set((s) => ({
              uploads: {
                ...s.uploads,
                [key]: { ...s.uploads[key], progress },
              },
            }));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () =>
          reject(new Error("Network error during upload")),
        );
        xhr.open("POST", uploadUrl);
        xhr.send(formData);
      });

      // Step 3 — Update store with success
      set((s) => ({
        uploads: {
          ...s.uploads,
          [key]: {
            status: "success",
            progress: 100,
            publicId: result.public_id,
            url: result.secure_url,
            error: null,
          },
        },
      }));

      return result.public_id;
    } catch (e: any) {
      set((s) => ({
        uploads: {
          ...s.uploads,
          [key]: {
            ...DEFAULT_UPLOAD_STATE,
            status: "error",
            error: e.message ?? "Upload failed",
          },
        },
      }));
      return null;
    }
  },

  // ── Delete a file from Cloudinary ─────────────────────────────────────────
  deleteFile: async (token, publicId) => {
    try {
      const res = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ publicId }),
      });

      return res.ok;
    } catch {
      return false;
    }
  },

  // ── Reset a single upload slot ─────────────────────────────────────────────
  resetUpload: (key) => {
    set((s) => ({
      uploads: { ...s.uploads, [key]: { ...DEFAULT_UPLOAD_STATE } },
    }));
  },

  // ── Reset all upload slots ─────────────────────────────────────────────────
  resetAll: () => set({ uploads: {} }),

  // ── Get a single upload slot (safe default if not yet initialised) ─────────
  getUpload: (key) => get().uploads[key] ?? { ...DEFAULT_UPLOAD_STATE },
}));

// ── Selector helpers ──────────────────────────────────────────────────────────
export const selectUpload = (key: string) => (s: UploadStoreState) =>
  s.uploads[key] ?? DEFAULT_UPLOAD_STATE;

export const selectIsUploading = (s: UploadStoreState) =>
  Object.values(s.uploads).some((u) => u.status === "uploading");
