// app/blog/page-components/BlogGrid.tsx
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { BlogCard } from "@/components/portfolio/blog-components";
import type { Post } from "@/lib/types";

const staggerGrid: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.3,
        },
    },
};

interface BlogGridProps {
    posts: Post[];
    filterKey: string;
}

export function BlogGrid({ posts, filterKey }: BlogGridProps) {
    return (
        <section className="w-full pb-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={filterKey}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerGrid}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                variants={cardVariants}
                                layout
                            >
                                <BlogCard post={post} index={0} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}