import { motion } from "framer-motion";

interface AvailabilityCardProps {
    availabilityNote?: string;
}

export function AvailabilityCard({ availabilityNote }: AvailabilityCardProps) {
    return (
        <motion.div
            className="rounded-xl px-5 py-4"
            style={{
                background: "var(--success-50)",
                border: "0.5px solid var(--success-500)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
        >
            <p
                className="text-xs font-medium flex items-center gap-1.5 mb-1"
                style={{ color: "var(--success-700)" }}
            >
                <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--success-500)" }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />
                Available for work
            </p>
            {availabilityNote && (
                <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--success-700)", opacity: 0.85 }}
                >
                    {availabilityNote}
                </p>
            )}
        </motion.div>
    );
}