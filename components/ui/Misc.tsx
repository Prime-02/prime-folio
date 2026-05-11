// components/ui/Tooltip.tsx
"use client";

import { useState } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content:    string;
  children:   React.ReactNode;
  position?:  TooltipPosition;
  className?: string;
}

const positionClasses: Record<TooltipPosition, { tooltip: string; arrow: string }> = {
  top: {
    tooltip: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    arrow:   "top-full left-1/2 -translate-x-1/2 border-t-[var(--bg-tertiary)] border-x-transparent border-b-transparent",
  },
  bottom: {
    tooltip: "top-full left-1/2 -translate-x-1/2 mt-2",
    arrow:   "bottom-full left-1/2 -translate-x-1/2 border-b-[var(--bg-tertiary)] border-x-transparent border-t-transparent",
  },
  left: {
    tooltip: "right-full top-1/2 -translate-y-1/2 mr-2",
    arrow:   "left-full top-1/2 -translate-y-1/2 border-l-[var(--bg-tertiary)] border-y-transparent border-r-transparent",
  },
  right: {
    tooltip: "left-full top-1/2 -translate-y-1/2 ml-2",
    arrow:   "right-full top-1/2 -translate-y-1/2 border-r-[var(--bg-tertiary)] border-y-transparent border-l-transparent",
  },
};

export function Tooltip({ content, children, position = "top", className = "" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const p = positionClasses[position];

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`absolute z-50 pointer-events-none ${p.tooltip}`}>
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
            {content}
          </div>
          <div className={`absolute w-0 h-0 border-4 ${p.arrow}`} />
        </div>
      )}
    </div>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
interface BreadcrumbItem {
  label:  string;
  href?:  string;
}

interface BreadcrumbProps {
  items:      BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 ${className}`}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {isLast || !item.href ? (
              <span className={`text-sm ${isLast ? "font-medium text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {item.label}
              </a>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
interface PaginationProps {
  page:       number;
  totalPages: number;
  onChange:   (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onChange, className = "" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const btnBase = "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200";

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${btnBase} text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-[var(--text-muted)] text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={[
              btnBase,
              p === page
                ? "bg-[var(--primary-600)] text-[var(--text-inverse)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]",
            ].join(" ")}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7 7 7" />
        </svg>
      </button>
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?:       React.ReactNode;
  title:       string;
  description?: string;
  action?:     React.ReactNode;
  className?:  string;
}

export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-muted)] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--text-muted)] max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
