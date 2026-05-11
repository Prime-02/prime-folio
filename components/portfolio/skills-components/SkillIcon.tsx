import CloudinaryImage from "@/components/ui/CloudinaryImage";

interface SkillIconProps {
    icon?: string | null;
    name: string;
    size?: "sm" | "md" | "lg";
}

const sizeMap = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
};

export function SkillIcon({ icon, name, size = "md" }: SkillIconProps) {
    const sizeClass = sizeMap[size];

    if (!icon) {
        return (
            <div
                className={`${sizeClass} rounded-lg shrink-0 flex items-center justify-center`}
                style={{
                    background: "var(--bg-primary)",
                    border: "0.5px solid var(--border-light)",
                }}
            >
                <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-muted)" }}
                >
                    {name.charAt(0).toUpperCase()}
                </span>
            </div>
        );
    }

    // If it's a Tabler icon name
    if (icon.startsWith("ti-")) {
        return (
            <div
                className={`${sizeClass} rounded-lg shrink-0 flex items-center justify-center`}
                style={{
                    background: "var(--bg-primary)",
                    border: "0.5px solid var(--border-light)",
                }}
            >
                <i
                    className={`ti ${icon} text-sm`}
                    style={{ color: "var(--text-secondary)" }}
                    aria-hidden="true"
                />
            </div>
        );
    }

    // Cloudinary image
    return (
        <div className={`${sizeClass} rounded-lg shrink-0 overflow-hidden`}>
            <CloudinaryImage
                src={icon}
                alt={name}
                className="w-full h-full object-contain"
            />
        </div>
    );
}