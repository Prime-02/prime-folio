// app/blog/page.tsx
"use client";

import { usePostStore } from "@/lib/stores";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { BlogSkeleton } from "@/components/portfolio/blog-components";
import {
    BlogHero,
    BlogFilters,
    BlogGrid,
    BlogEmpty,
} from "./page-components";
import { Pagination } from "../projects/page-components";

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

export default function BlogPage() {
    const {
        posts,
        isLoading,
        pagination,
        nextPage,
        previousPage,
        goToPage,
        setFilter,
        clearFilters: clearStoreFilters
    } = usePostStore();

    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [showFeatured, setShowFeatured] = useState<boolean>(false);

    useEffect(() => {
        setFilter({ featured: undefined });
    }, [setFilter]);

    // Get all unique tags
    const allTags = useMemo(() => {
        if (!Array.isArray(posts)) return [];
        const tags = new Set<string>();
        posts.forEach((p) => p.tags.forEach((tag) => tags.add(tag)));
        return Array.from(tags).sort();
    }, [posts]);

    // Filter posts
    const filteredPosts = useMemo(() => {
        if (!Array.isArray(posts)) return [];
        return posts;
    }, [posts]);

    // Filter handlers - update store filters and refetch
    const handleShowAll = () => {
        setActiveTag(null);
        setShowFeatured(false);
        setFilter({ tag: null, featured: null });
    };

    const handleToggleFeatured = () => {
        const newFeatured = !showFeatured;
        setShowFeatured(newFeatured);
        setActiveTag(null);
        setFilter({ featured: newFeatured ? true : null, tag: null });
    };

    const handleToggleTag = (tag: string) => {
        const newTag = activeTag === tag ? null : tag;
        setActiveTag(newTag);
        setShowFeatured(false);
        setFilter({ tag: newTag, featured: null });
    };

    const handleClearFilters = () => {
        setActiveTag(null);
        setShowFeatured(false);
        clearStoreFilters();
    };

    // Generate page numbers for pagination
    const getPageNumbers = useCallback(() => {
        if (!pagination) return [];

        const { page, totalPages } = pagination;
        const pages: (number | string)[] = [];
        const delta = 2;

        pages.push(1);

        const rangeStart = Math.max(2, page - delta);
        const rangeEnd = Math.min(totalPages - 1, page + delta);

        if (rangeStart > 2) {
            pages.push('...');
        }

        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }

        if (rangeEnd < totalPages - 1) {
            pages.push('...');
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    }, [pagination]);

    if (isLoading && posts.length === 0) return <BlogSkeleton />;

    const filterKey = activeTag ?? (showFeatured ? "featured" : "all");

    return (
        <motion.div
            className="min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Hero Section */}
            <BlogHero />

            {/* Filters Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <BlogFilters
                    allTags={allTags}
                    activeTag={activeTag}
                    showFeatured={showFeatured}
                    onShowAll={handleShowAll}
                    onToggleFeatured={handleToggleFeatured}
                    onToggleTag={handleToggleTag}
                />
            </div>

            {/* Blog Posts Grid or Empty State */}
            {filteredPosts.length > 0 ? (
                <>
                    <BlogGrid posts={filteredPosts} filterKey={filterKey} />

                    {/* Pagination Controls */}
                    {pagination && pagination.totalPages > 1 && (
                        <Pagination
                            pagination={pagination}
                            onNextPage={nextPage}
                            onPreviousPage={previousPage}
                            onGoToPage={goToPage}
                            getPageNumbers={getPageNumbers}
                            itemLabel="posts"
                        />
                    )}
                </>
            ) : (
                <BlogEmpty onClearFilters={handleClearFilters} />
            )}

            {/* Back to home */}
            <motion.div
                className="text-center pb-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm group"
                    style={{ color: "var(--text-muted)" }}
                >
                    <motion.i
                        className="ti ti-arrow-left"
                        aria-hidden="true"
                        whileHover={{ x: -3 }}
                        transition={{ duration: 0.2 }}
                    />
                    Back to home
                </Link>
            </motion.div>
        </motion.div>
    );
}