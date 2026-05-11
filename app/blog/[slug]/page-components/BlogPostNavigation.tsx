// app/blog/[slug]/page-components/BlogPostNavigation.tsx
import { motion, type Variants } from "framer-motion";
import Link from "next/link";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

interface BlogPostNavigationProps {
    publishedAt: Date | string | null;
    createdAt: Date | string;
    readingTime: string | null;
}

export function BlogPostNavigation({
    publishedAt,
    createdAt,
    readingTime,
}: BlogPostNavigationProps) {
    const publishedDate = publishedAt ?? createdAt;

    return (
        <section className="w-full pb-16 md:pb-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
                    style={{ borderTop: "0.5px solid var(--border-light)" }}
                    variants={fadeInUp}
                >
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm group"
                        style={{ color: "var(--text-muted)" }}
                    >
                        <motion.i
                            className="ti ti-arrow-left"
                            aria-hidden="true"
                            whileHover={{ x: -3 }}
                            transition={{ duration: 0.2 }}
                        />
                        Back to all posts
                    </Link>

                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                        <span>
                            Published {formatDate(publishedDate)}
                        </span>
                        {readingTime && (
                            <>
                                <span>·</span>
                                <span>{readingTime}</span>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}