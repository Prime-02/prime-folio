"use client";

import { usePostStore } from "@/lib/stores";
import { useEffect, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
    BlogSkeleton,
    BlogGrid,
} from "./blog-components";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

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

export default function BlogSection() {
    const { fetchPosts, posts, isLoading } = usePostStore();

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const publishedPosts = useMemo(() => {
        return [...posts]
            .filter((p) => p.published)
            .sort((a, b) => {
                // Featured first
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;

                // Then by date (newest first)
                const dateA = new Date(a.publishedAt ?? a.createdAt).getTime();
                const dateB = new Date(b.publishedAt ?? b.createdAt).getTime();
                return dateB - dateA;
            });
    }, [posts]);

    if (isLoading) return <BlogSkeleton />;

    const hasMorePosts = publishedPosts.length > 3;

    return (
        <motion.section
            id="blog"
            aria-label="Blog"
            className="w-full py-16 md:py-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <motion.div variants={headerVariants}>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p
                                className="text-[10px] tracking-widest uppercase font-medium mb-2"
                                style={{ color: "var(--text-muted)" }}
                            >
                                Writing
                            </p>
                            <h2
                                className="font-Montserrat font-medium"
                                style={{
                                    fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
                                    color: "var(--text-primary)"
                                }}
                            >
                                Latest Blog Posts
                            </h2>
                        </div>

                        {hasMorePosts && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <Link
                                    href="/blog"
                                    className="btn btn-outline btn-sm group"
                                >
                                    <span>See all</span>
                                    <motion.i
                                        className="ti ti-arrow-right text-sm ml-1"
                                        aria-hidden="true"
                                        initial={{ x: 0 }}
                                        whileHover={{ x: 3 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </Link>
                            </motion.div>
                        )}
                    </div>
                    <div
                        className="w-10 h-0.5 rounded-full mb-10"
                        style={{ background: "var(--border-color)" }}
                    />
                </motion.div>

                {/* Blog grid */}
                <BlogGrid posts={publishedPosts} showAll={false} />

                {/* Bottom "See All" button for mobile */}
                {hasMorePosts && (
                    <motion.div
                        className="flex justify-center mt-8 lg:hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <Link
                            href="/blog"
                            className="btn btn-outline btn-md group"
                        >
                            <span>See all posts</span>
                            <motion.i
                                className="ti ti-arrow-right text-sm ml-2"
                                aria-hidden="true"
                                whileHover={{ x: 3 }}
                                transition={{ duration: 0.2 }}
                            />
                        </Link>
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
}