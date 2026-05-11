// components/ui/Toast.tsx
"use client";

import { useUIStore, selectToasts } from "@/lib/stores";
import type { Toast as ToastType, ToastVariant } from "@/lib/stores";

const variantStyles: Record<ToastVariant, { bar: string; icon: string; bg: string }> = {
  success: {
    bg:   "bg-[var(--bg-secondary)] border-[var(--success-500)]",
    bar:  "bg-[var(--success-500)]",
    icon: "text-[var(--success-500)]",
  },
  error: {
    bg:   "bg-[var(--bg-secondary)] border-[var(--error-500)]",
    bar:  "bg-[var(--error-500)]",
    icon: "text-[var(--error-500)]",
  },
  warning: {
    bg:   "bg-[var(--bg-secondary)] border-[var(--warning-500)]",
    bar:  "bg-[var(--warning-500)]",
    icon: "text-[var(--warning-500)]",
  },
  info: {
    bg:   "bg-[var(--bg-secondary)] border-[var(--info-500)]",
    bar:  "bg-[var(--info-500)]",
    icon: "text-[var(--info-500)]",
  },
};

const icons: Record<ToastVariant, React.ReactNode> = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
    </svg>
  ),
};

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useUIStore((s) => s.removeToast);
  const styles = variantStyles[toast.variant];

  return (
    <div
      className={[
        "relative flex items-start gap-3 w-80 rounded-xl border-l-4 p-4 shadow-xl overflow-hidden",
        styles.bg,
      ].join(" ")}
      role="alert"
    >
      <span className={`shrink-0 mt-0.5 ${styles.icon}`}>{icons[toast.variant]}</span>

      <p className="flex-1 text-sm text-[var(--text-primary)] leading-snug">
        {toast.message}
      </p>

      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ── Toast Container — place once in layout.tsx ────────────────────────────────
export default function ToastContainer() {
  const toasts = useUIStore(selectToasts);
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
}
