// components/ui/Toggle.tsx
"use client";

interface ToggleProps {
  checked:    boolean;
  onChange:   (checked: boolean) => void;
  label?:     string;
  hint?:      string;
  disabled?:  boolean;
  size?:      "sm" | "md" | "lg";
}

const sizes = {
  sm: { track: "w-8 h-4",   thumb: "w-3 h-3",   translate: "translate-x-4" },
  md: { track: "w-11 h-6",  thumb: "w-5 h-5",   translate: "translate-x-5" },
  lg: { track: "w-14 h-7",  thumb: "w-6 h-6",   translate: "translate-x-7" },
};

export default function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled = false,
  size     = "md",
}: ToggleProps) {
  const s = sizes[size];

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent",
          "transition-colors duration-200 ease-in-out focus:outline-none",
          "focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          s.track,
          checked
            ? "bg-[var(--primary-600)]"
            : "bg-[var(--bg-tertiary)]",
        ].join(" ")}
      >
        <span
          className={[
            "pointer-events-none inline-block rounded-full",
            "bg-white shadow-md transform transition-transform duration-200 ease-in-out",
            s.thumb,
            checked ? s.translate : "translate-x-0",
          ].join(" ")}
        />
      </button>

      {(label || hint) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {label}
            </span>
          )}
          {hint && (
            <span className="text-xs text-[var(--text-muted)]">{hint}</span>
          )}
        </div>
      )}
    </div>
  );
}
