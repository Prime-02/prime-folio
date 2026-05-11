import { motion } from "framer-motion";

export function AvailabilityBadge() {
    return (
        <motion.span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{
                border: "0.5px solid var(--success-500)",
                background: "var(--success-50)",
                color: "var(--success-700)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
            <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--success-500)" }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            />
            Available for work
        </motion.span>
    );
}