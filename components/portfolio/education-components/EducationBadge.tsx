import { motion } from "framer-motion";

interface EducationBadgeProps {
    type: "current" | "honors" | "thesis" | "gpa";
    value?: string;
}

const badgeConfig = {
    current: {
        label: "Current",
        bgColor: "var(--success-50)",
        color: "var(--success-700)",
        borderColor: "var(--success-500)",
        icon: null,
        dot: true,
    },
    honors: {
        label: "Honors",
        bgColor: "var(--warning-50)",
        color: "var(--warning-700)",
        borderColor: "var(--warning-500)",
        icon: "ti-award",
        dot: false,
    },
    thesis: {
        label: "Thesis",
        bgColor: "var(--info-50)",
        color: "var(--info-700)",
        borderColor: "var(--info-500)",
        icon: "ti-book",
        dot: false,
    },
    gpa: {
        label: "GPA",
        bgColor: "var(--primary-50)",
        color: "var(--primary-700)",
        borderColor: "var(--primary-500)",
        icon: "ti-chart-bar",
        dot: false,
    },
};

export function EducationBadge({ type, value }: EducationBadgeProps) {
    const config = badgeConfig[type];

    return (
        <motion.span
            className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
            style={{
                background: config.bgColor,
                color: config.color,
                border: `0.5px solid ${config.borderColor}`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
        >
            {config.dot && (
                <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: config.borderColor }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />
            )}
            {config.icon && (
                <i className={`ti ${config.icon} text-xs`} aria-hidden="true" />
            )}
            {value ? `${config.label}: ${value}` : config.label}
        </motion.span>
    );
}