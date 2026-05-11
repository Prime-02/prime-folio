// components/ui/Input.tsx
"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

type InputSize = "sm" | "md" | "lg";
type InputVariant = "default" | "filled" | "error" | "success";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string | React.ReactNode;  // Changed to accept ReactNode
  error?: string;
  inputSize?: InputSize;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  full?: boolean;
  showCharCount?: boolean;  // Optional: show character count for maxLength fields
}

const sizeMap: Record<InputSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-5 py-3 text-lg",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      inputSize = "md",
      variant = "default",
      leftIcon,
      rightIcon,
      full = true,
      showCharCount = false,
      className = "",
      id,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const charCount = typeof value === "string" ? value.length : 0;

    const baseInput = [
      "rounded-lg border-2 transition-all duration-200 outline-none font-[Poppins]",
      "bg-[var(--bg-primary)] text-[var(--text-primary)]",
      "placeholder:text-[var(--text-muted)]",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--bg-tertiary)]",
      sizeMap[inputSize],
      leftIcon ? "pl-10" : "",
      rightIcon ? "pr-10" : "",
      full ? "w-full" : "",
      error
        ? "border-[var(--error-500)] bg-[var(--error-50)] focus:ring-2 focus:ring-[var(--error-500)]/20 focus:border-[var(--error-500)]"
        : variant === "success"
          ? "border-[var(--success-500)] focus:ring-2 focus:ring-[var(--success-500)]/20 focus:border-[var(--success-500)]"
          : variant === "filled"
            ? "border-[var(--bg-secondary)] bg-[var(--bg-secondary)] focus:border-[var(--primary-500)] focus:bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary-500)]/10"
            : "border-[var(--border-color)] hover:border-[var(--border-hover)] focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/10",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Calculate character count color
    const getCharCountColor = () => {
      if (!maxLength) return "text-[var(--text-muted)]";
      if (charCount > maxLength) return "text-[var(--error-500)] font-medium";
      if (charCount > maxLength * 0.9) return "text-amber-500";
      return "text-[var(--text-muted)]";
    };

    return (
      <div className={`flex flex-col gap-1.5 ${full ? "w-full" : ""}`}>
        {(label || showCharCount) && (
          <div className="flex justify-between items-center">
            {label && (
              <label
                htmlFor={inputId}
                className="text-sm font-medium text-[var(--text-secondary)]"
              >
                {label}
                {props.required && (
                  <span className="text-[var(--error-500)] ml-1">*</span>
                )}
              </label>
            )}
            {showCharCount && maxLength && (
              <span className={`text-xs ${getCharCountColor()}`}>
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[var(--text-muted)] pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={baseInput}
            maxLength={maxLength}
            value={value}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 text-[var(--text-muted)] pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-[var(--error-500)]">{error}</p>
        )}
        {hint && !error && (
          <div className="text-xs text-[var(--text-muted)]">
            {typeof hint === "string" ? <p>{hint}</p> : hint}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;