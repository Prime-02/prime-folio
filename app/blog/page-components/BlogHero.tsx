// app/blog/page-components/BlogHero.tsx
import { motion, type Variants } from "framer-motion";

const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
};

export function BlogHero() {
    return (
        <section className="w-full py-16 md:py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div variants={headerVariants} className="text-center mb-12">
                    <motion.p
                        className="text-[10px] tracking-widest uppercase font-medium mb-3"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Writing
                    </motion.p>
                    <motion.h1
                        className="font-Montserrat font-medium mb-4"
                        style={{
                            fontSize: "clamp(1.875rem, 5vw, 3rem)",
                            color: "var(--text-primary)",
                        }}
                    >
                        Blog Posts
                    </motion.h1>
                    <motion.p
                        className="text-sm max-w-lg mx-auto"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Thoughts on web development, design, and technology.
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}