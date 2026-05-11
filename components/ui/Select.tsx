// components/ui/Select.tsx
"use client";

import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectGroup {
  group: string;
  options: SelectOption[];
}

// Omit the native 'size' attribute from HTML attributes since we're using our own
interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  options?: SelectOption[];
  groups?: SelectGroup[];
  full?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outline" | "ghost";
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      options = [],
      groups = [],
      full = true,
      size = "md",
      variant = "default",
      placeholder,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    const sizeClass = {
      sm: "select-sm",
      md: "select-md",
      lg: "select-lg",
    }[size];

    const variantClass = {
      default: "",
      filled: "select-filled",
      outline: "select-outline",
      ghost: "select-ghost",
    }[variant];

    const base = [
      sizeClass,
      variantClass,
      full ? "select-full" : "",
      error ? "select-error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`select-group ${full ? "w-full" : ""}`}>
        {label && (
          <label htmlFor={inputId} className="select-label">
            {label}
          </label>
        )}

        <select ref={ref} id={inputId} className={base} {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {groups.length > 0
            ? groups.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.options.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.disabled}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))
            : options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            ))}
        </select>

        {error && <p className="select-error-message">{error}</p>}
        {hint && !error && <p className="select-hint">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;