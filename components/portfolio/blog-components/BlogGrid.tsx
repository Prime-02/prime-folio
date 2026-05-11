import { motion } from "framer-motion";
import { BlogCard } from "./BlogCard";
import { staggerContainer } from "./animations";

interface Post {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    coverImage?: string | null;
    tags: string[];
    published: boolean;
    featured: boolean;
    publishedAt?: Date | string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface BlogGridProps {
    posts: Post[];
    showAll?: boolean;
}

export function BlogGrid({ posts, showAll = false }: BlogGridProps) {
    const displayPosts = showAll ? posts : posts.slice(0, 3);

    if (!displayPosts || displayPosts.length === 0) {
        return (
            <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <i
                    className="ti ti-article text-4xl mb-4 block"
                    style={{ color: "var(--text-muted)" }}
                    aria-hidden="true"
                />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    No blog posts yet.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
        >
            {displayPosts.map((post, index) => (
                <BlogCard
                    key={post.id}
                    post={post}
                    index={index}
                />
            ))}
        </motion.div>
    );
}