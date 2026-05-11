// app/blog/[slug]/page-components/BlogPostContent.tsx
import { PreviewPane } from "@/components/ui/markdown/PreviewPane";
import { motion, type Variants } from "framer-motion";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

interface BlogPostContentProps {
    content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
    return (
        <section className="w-full py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <motion.div
                    className="prose prose-lg max-w-none"
                    variants={fadeInUp}
                >
                    <PreviewPane markdown={content} />
                </motion.div>
            </div>
        </section>
    );
}