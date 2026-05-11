import { motion } from "framer-motion";

interface ExperienceBadgeProps {
    type: "current" | "remote" | "fulltime" | "contract";
}

const badgeConfig = {
    current: {
        label: "Current",
        icon: null,
        bgColor: "var(--success-50)",
        color: "var(--success-700)",
        borderColor: "var(--success-500)",
        dot: true,
    },
    remote: {
        label: "Remote",
        icon: "ti-world",
        bgColor: "var(--info-50)",
        color: "var(--info-700)",
        borderColor: "var(--info-500)",
        dot: false,
    },
    fulltime: {
        label: "Full-time",
        icon: null,
        bgColor: "var(--primary-50)",
        color: "var(--primary-700)",
        borderColor: "var(--primary-500)",
        dot: false,
    },
    contract: {
        label: "Contract",
        icon: null,
        bgColor: "var(--warning-50)",
        color: "var(--warning-700)",
        borderColor: "var(--warning-500)",
        dot: false,
    },
};

export function ExperienceBadge({ type }: ExperienceBadgeProps) {
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
            {config.label}
        </motion.span>
    );
}