// app/blog/[slug]/page-components/BlogPostHero.tsx
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

interface BlogPostHeroProps {
    title: string;
    summary: string;
    tags: string[];
    featured: boolean;
    publishedAt: Date | string | null;
    createdAt: Date | string;
    readingTime: string | null;
}

export function BlogPostHero({
    title,
    summary,
    tags,
    featured,
    publishedAt,
    createdAt,
    readingTime,
}: BlogPostHeroProps) {
    const publishedDate = publishedAt ?? createdAt;

    return (
        <section className="w-full py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <motion.div variants={fadeInUp}>
                    {/* Back button */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm mb-6 group"
                        style={{ color: "var(--text-muted)" }}
                    >
                        <motion.i
                            className="ti ti-arrow-left"
                            aria-hidden="true"
                            whileHover={{ x: -3 }}
                            transition={{ duration: 0.2 }}
                        />
                        Back to blog
                    </Link>

                    {/* Featured badge */}
                    {featured && (
                        <motion.span
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-6"
                            style={{
                                background: "var(--warning-50)",
                                color: "var(--warning-700)",
                                border: "0.5px solid var(--warning-500)",
                            }}
                        >
                            <i className="ti ti-star text-xs" aria-hidden="true" />
                            Featured Post
                        </motion.span>
                    )}

                    {/* Title */}
                    <h1
                        className="font-Montserrat font-medium mb-6"
                        style={{
                            fontSize: "clamp(2rem, 5vw, 3rem)",
                            color: "var(--text-primary)",
                            lineHeight: 1.2,
                        }}
                    >
                        {title}
                    </h1>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                        <div
                            className="flex items-center gap-2"
                            style={{ color: "var(--text-muted)" }}
                        >
                            <i className="ti ti-calendar" aria-hidden="true" />
                            <time dateTime={new Date(publishedDate).toISOString()}>
                                {formatDate(publishedDate)}
                            </time>
                        </div>
                        {readingTime && (
                            <div
                                className="flex items-center gap-2"
                                style={{ color: "var(--text-muted)" }}
                            >
                                <i className="ti ti-clock" aria-hidden="true" />
                                <span>{readingTime}</span>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs font-medium px-3 py-1 rounded-full"
                                style={{
                                    background: "var(--bg-primary)",
                                    color: "var(--text-muted)",
                                    border: "0.5px solid var(--border-light)",
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Summary */}
                    <div
                        className="text-lg leading-relaxed mb-8 p-6 rounded-xl"
                        style={{
                            background: "var(--bg-secondary)",
                            border: "0.5px solid var(--border-light)",
                            color: "var(--text-secondary)",
                        }}
                    >
                        {summary}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}