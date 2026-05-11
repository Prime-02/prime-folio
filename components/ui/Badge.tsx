// components/ui/Badge.tsx

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "outline";
type BadgeSize    = "sm" | "md" | "lg";

interface BadgeProps {
  children:   React.ReactNode;
  variant?:   BadgeVariant;
  size?:      BadgeSize;
  dot?:       boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
  success: "bg-[var(--success-100)] text-[var(--success-700)]",
  warning: "bg-[var(--warning-100)] text-[var(--warning-700)]",
  error:   "bg-[var(--error-100)]   text-[var(--error-700)]",
  info:    "bg-[var(--info-100)]    text-[var(--info-700)]",
  outline: "bg-transparent border border-[var(--border-color)] text-[var(--text-secondary)]",
};

const dotClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--text-muted)]",
  success: "bg-[var(--success-500)]",
  warning: "bg-[var(--warning-500)]",
  error:   "bg-[var(--error-500)]",
  info:    "bg-[var(--info-500)]",
  outline: "bg-[var(--text-muted)]",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-xs px-1.5 py-0.5",
  md: "text-xs px-2.5 py-1",
  lg: "text-sm px-3 py-1.5",
};

export default function Badge({
  children,
  variant   = "default",
  size      = "md",
  dot       = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {dot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
