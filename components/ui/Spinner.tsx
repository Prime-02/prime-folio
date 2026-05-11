// components/ui/Spinner.tsx

type SpinnerSize    = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "primary" | "white" | "muted";

interface SpinnerProps {
  size?:      SpinnerSize;
  variant?:   SpinnerVariant;
  label?:     string;   // screen-reader text
  className?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: "w-3 h-3 border",
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-2",
  xl: "w-12 h-12 border-4",
};

const colorMap: Record<SpinnerVariant, string> = {
  primary: "border-[var(--primary-300)] border-t-[var(--primary-600)]",
  white:   "border-white/30 border-t-white",
  muted:   "border-[var(--border-color)] border-t-[var(--text-muted)]",
};

export default function Spinner({
  size      = "md",
  variant   = "primary",
  label     = "Loading…",
  className = "",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={[
        "inline-block rounded-full animate-spin",
        sizeMap[size],
        colorMap[variant],
        className,
      ].join(" ")}
    />
  );
}

// ── Full-page loading overlay ─────────────────────────────────────────────────
export function PageLoader({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[var(--bg-primary)]">
      <Spinner size="xl" />
      <p className="text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}

// ── Inline section loader ─────────────────────────────────────────────────────
export function SectionLoader({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Spinner size="lg" />
      <p className="text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}
