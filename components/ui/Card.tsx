// components/ui/Card.tsx

interface CardProps {
  children:    React.ReactNode;
  className?:  string;
  padding?:    "none" | "sm" | "md" | "lg";
  border?:     boolean;
  hover?:      boolean;
  onClick?:    () => void;
}

interface CardHeaderProps {
  title:        string;
  description?: string;
  action?:      React.ReactNode;
  className?:   string;
}

interface CardSectionProps {
  children:   React.ReactNode;
  className?: string;
}

const paddingMap = {
  none: "",
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-8",
};

export function Card({
  children,
  className = "",
  padding   = "md",
  border    = true,
  hover     = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        "card rounded-xl",
        paddingMap[padding],
        border ? "border border-[var(--border-light)]" : "",
        hover  ? "transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-lg cursor-pointer" : "",
        onClick ? "cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className = "" }: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = "" }: CardSectionProps) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardSectionProps) {
  return (
    <div
      className={`mt-6 pt-4 border-t border-[var(--border-light)] flex items-center gap-3 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
