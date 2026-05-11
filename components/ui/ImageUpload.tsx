// components/ui/ImageUpload.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import { useUploadStore } from "@/lib/stores";
import { resolveImageUrl } from "@/lib/cloudinary/helpers";
import type { UploadFolder } from "@/lib/cloudinary";
import Spinner from "./Spinner";

interface ImageUploadProps {
  token: string;
  folder: UploadFolder;
  uploadKey: string;
  value?: string | null;
  onChange: (publicId: string | null) => void;
  label?: string;
  hint?: string;
  accept?: string;
  maxSizeMB?: number;
  aspectRatio?: "square" | "video" | "banner" | "free";
  className?: string;
  minHeight?: number; // New prop for customizing minimum height
}

const aspectMap = {
  square: "aspect-square",
  video: "aspect-video",
  banner: "aspect-[3/1]",
  free: "",
};

export default function ImageUpload({
  token,
  folder,
  uploadKey,
  value,
  onChange,
  label,
  hint,
  accept = "image/*",
  aspectRatio = "free",
  className = "",
  minHeight = 120, // Default to 120 but allow override
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { uploadFile, deleteFile, getUpload, resetUpload } = useUploadStore();
  const upload = getUpload(uploadKey);

  const previewUrl = value
    ? resolveImageUrl(value, { width: 400, height: 400, crop: "fill" })
    : null;

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      const publicId = await uploadFile(token, uploadKey, file, folder);
      if (publicId) {
        onChange(publicId);
      } else {
        const currentUpload = useUploadStore.getState().getUpload(uploadKey);
        setError(currentUpload.error ?? "Upload failed");
      }
    },
    [token, uploadKey, folder, uploadFile, onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = async () => {
    if (value) await deleteFile(token, value);
    onChange(null);
    resetUpload(uploadKey);
  };

  const isUploading = upload.status === "uploading";

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
      )}

      <div
        className={[
          "relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden",
          aspectMap[aspectRatio],
          dragOver
            ? "border-[var(--primary-500)] bg-[var(--primary-500)]/5"
            : "border-[var(--border-color)] hover:border-[var(--border-hover)]",
          isUploading ? "pointer-events-none" : "cursor-pointer",
        ].join(" ")}
        style={{ minHeight: `${minHeight}px` }} // Use style for dynamic value
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Preview */}
        {previewUrl && !isUploading && (
          <img
            src={previewUrl}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Upload progress overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--bg-primary)]/80">
            <Spinner size="lg" />
            <div className="w-3/4">
              <div className="h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                <div
                  className="h-full bg-[var(--primary-600)] transition-all duration-300 rounded-full"
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
              <p className="text-xs text-center text-[var(--text-muted)] mt-1">
                {upload.progress}%
              </p>
            </div>
          </div>
        )}

        {/* Empty state - Only show if there's enough space */}
        {!previewUrl && !isUploading && minHeight >= 80 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Click or drag to upload
              </p>
            </div>
          </div>
        )}

        {/* Compact empty state for small uploaders */}
        {!previewUrl && !isUploading && minHeight < 80 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        )}

        {/* Remove button */}
        {previewUrl && !isUploading && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleRemove(); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            aria-label="Remove image"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <label htmlFor="upload-file" className="hidden">upload file</label>
      <input
        id="upload-file"
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />

      {error && <p className="text-xs text-[var(--error-500)]">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}