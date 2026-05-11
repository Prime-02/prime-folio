// components/ui/Textarea.tsx
"use client";

import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:   string;
  hint?:    string;
  error?:   string;
  full?:    boolean;
  resize?:  "none" | "vertical" | "horizontal" | "both";
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      full    = true,
      resize  = "vertical",
      rows    = 4,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    const resizeClass: Record<string, string> = {
      none:       "resize-none",
      vertical:   "resize-y",
      horizontal: "resize-x",
      both:       "resize",
    };

    const base = [
      "rounded-lg border-2 transition-all duration-200 outline-none font-[Poppins]",
      "bg-[var(--bg-primary)] text-[var(--text-primary)]",
      "placeholder:text-[var(--text-muted)]",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "px-4 py-2.5 text-base",
      resizeClass[resize],
      full ? "w-full" : "",
      error
        ? "border-[var(--error-500)] bg-[var(--error-50)] focus:ring-2 focus:ring-[var(--error-500)]/20"
        : "border-[var(--border-color)] hover:border-[var(--border-hover)] focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/10",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`flex flex-col gap-1.5 ${full ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}

        <textarea ref={ref} id={inputId} rows={rows} className={base} {...props} />

        {error && <p className="text-xs text-[var(--error-500)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
