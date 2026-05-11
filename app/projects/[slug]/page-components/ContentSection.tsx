import { motion, type Variants } from "framer-motion";
import { MarkdownRenderer } from "./MarkdownRenderer";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

interface ContentSectionProps {
    description: string;
}

export function ContentSection({ description }: ContentSectionProps) {
    return (
        <section className="w-full py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <motion.div variants={fadeInUp}>
                    <MarkdownRenderer content={description} />
                </motion.div>
            </div>
        </section>
    );
}