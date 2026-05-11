interface CardTitleProps {
    children: React.ReactNode;
}

export function CardTitle({ children }: CardTitleProps) {
    return (
        <p
            className="text-[10px] tracking-widest uppercase font-medium mb-3"
            style={{ color: "var(--text-muted)" }}
        >
            {children}
        </p>
    );
}