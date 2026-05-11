import { motion } from "framer-motion";

interface AvailabilityNoteProps {
    note: string;
}

export function AvailabilityNote({ note }: AvailabilityNoteProps) {
    return (
        <motion.p
            className="text-xs text-center leading-relaxed max-w-[180px]"
            style={{ color: "var(--text-muted)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
        >
            {note}
        </motion.p>
    );
}