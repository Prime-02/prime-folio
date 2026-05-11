import { motion } from "framer-motion";
import { fadeInUp } from "./animations";

interface MetaItemProps {
    icon: string;
    label: string;
}

export function MetaItem({ icon, label }: MetaItemProps) {
    return (
        <motion.span
            className="inline-flex items-center gap-1.5 text-xs"
            style={{ color: "var(--text-muted)" }}
            variants={fadeInUp}
        >
            <i className={`ti ${icon} text-sm`} aria-hidden="true" />
            {label}
        </motion.span>
    );
}