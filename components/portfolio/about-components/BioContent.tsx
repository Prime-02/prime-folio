import { motion } from "framer-motion";
import { PreviewPane } from "@/components/ui/markdown/PreviewPane";

interface BioContentProps {
    bio: string;
}

export function BioContent({ bio }: BioContentProps) {
    return (
        <motion.div
            className="prose-bio text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
            <PreviewPane markdown={bio} />
        </motion.div>
    );
}