import { motion } from "framer-motion";
import { fadeInUp } from "./animations";

interface InfoRowProps {
    icon: string;
    label: string;
    value: string;
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
    return (
        <motion.div
            className="flex items-start gap-3 py-2.5"
            style={{ borderBottom: "0.5px solid var(--border-light)" }}
            variants={fadeInUp}
        >
            <i
                className={`ti ${icon} text-base mt-0.5 shrink-0`}
                style={{ color: "var(--text-muted)" }}
                aria-hidden="true"
            />
            <div>
                <p className="text-[10px] mb-0.5" style={{ color: "var(--text-muted)" }}>
                    {label}
                </p>
                <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                    {value}
                </p>
            </div>
        </motion.div>
    );
}