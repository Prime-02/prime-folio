import { motion } from "framer-motion";

interface CardProps {
    children: React.ReactNode;
    delay?: number;
}

export function Card({ children, delay = 0 }: CardProps) {
    return (
        <motion.div
            className="rounded-xl p-5"
            style={{
                background: "var(--bg-secondary)",
                border: "0.5px solid var(--border-light)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
            }}
        >
            {children}
        </motion.div>
    );
}