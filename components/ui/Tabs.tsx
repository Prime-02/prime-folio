// components/ui/Tabs.tsx
"use client";

import { useState } from "react";

interface Tab {
  id:       string;
  label:    string;
  icon?:    React.ReactNode;
  badge?:   number;
  disabled?: boolean;
}

interface TabsProps {
  tabs:       Tab[];
  defaultTab?: string;
  onChange?:  (id: string) => void;
  variant?:   "underline" | "pills" | "bordered";
  children:   (activeTab: string) => React.ReactNode;
}

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant  = "underline",
  children,
}: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  const handleChange = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  const tabBase = "inline-flex items-center gap-2 font-medium transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    underline: {
      container: "flex border-b border-[var(--border-light)] gap-1 overflow-x-auto",
      tab: (isActive: boolean) =>
        `${tabBase} px-4 py-3 text-sm border-b-2 -mb-px ${
          isActive
            ? "border-[var(--primary-600)] text-[var(--text-primary)]"
            : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
        }`,
    },
    pills: {
      container: "flex gap-2 overflow-x-auto",
      tab: (isActive: boolean) =>
        `${tabBase} px-4 py-2 text-sm rounded-lg ${
          isActive
            ? "bg-[var(--primary-600)] text-[var(--text-inverse)]"
            : "text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
        }`,
    },
    bordered: {
      container: "flex gap-0 border border-[var(--border-color)] rounded-lg p-1 overflow-x-auto",
      tab: (isActive: boolean) =>
        `${tabBase} px-4 py-2 text-sm rounded-md ${
          isActive
            ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`,
    },
  };

  const v = variants[variant];

  return (
    <div>
      <div className={v.container} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && handleChange(tab.id)}
            className={v.tab(active === tab.id)}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-[var(--error-500)] text-white leading-none">
                {tab.badge > 99 ? "99+" : tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div
        id={`tab-panel-${active}`}
        role="tabpanel"
        className="mt-4"
      >
        {children(active)}
      </div>
    </div>
  );
}
