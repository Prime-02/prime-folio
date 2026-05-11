import { motion } from "framer-motion";

type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

interface ProficiencyBadgeProps {
    level: SkillLevel;
}

const levelConfig: Record<SkillLevel, { label: string; color: string; bgColor: string; borderColor: string; width: string }> = {
    BEGINNER: {
        label: "Beginner",
        color: "var(--text-muted)",
        bgColor: "var(--bg-secondary)",
        borderColor: "var(--border-light)",
        width: "25%",
    },
    INTERMEDIATE: {
        label: "Intermediate",
        color: "var(--info-700)",
        bgColor: "var(--info-50)",
        borderColor: "var(--info-500)",
        width: "50%",
    },
    ADVANCED: {
        label: "Advanced",
        color: "var(--warning-700)",
        bgColor: "var(--warning-50)",
        borderColor: "var(--warning-500)",
        width: "75%",
    },
    EXPERT: {
        label: "Expert",
        color: "var(--success-700)",
        bgColor: "var(--success-50)",
        borderColor: "var(--success-500)",
        width: "100%",
    },
};

export function ProficiencyBadge({ level }: ProficiencyBadgeProps) {
    const config = levelConfig[level] ?? levelConfig.INTERMEDIATE;

    return (
        <div className="flex items-center gap-2">
            <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                    background: config.bgColor,
                    color: config.color,
                    border: `0.5px solid ${config.borderColor}`,
                }}
            >
                {config.label}
            </span>
            <div className="flex-1 h-1 rounded-full" style={{ background: "var(--bg-tertiary)" }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{
                        width: config.width,
                        background: config.borderColor,
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: config.width }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}