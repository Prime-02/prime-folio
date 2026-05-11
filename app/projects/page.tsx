// page.tsx
"use client";

import { useProjectStore } from "@/lib/stores";
import { useEffect, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ProjectsSkeleton } from "@/components/portfolio/projects-components";
import {
    ProjectsHero,
    ProjectsFilters,
    ProjectsGrid,
    ProjectsEmpty,
    Pagination,
} from "./page-components";

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

export default function ProjectsPage() {
    const {
        projects,
        isLoading,
        pagination,
        filters,
        nextPage,
        previousPage,
        goToPage,
        setFilter,
        clearFilters,
    } = useProjectStore();

    // Compute tags locally with useMemo
    const allTags = useMemo(() => {
        if (!Array.isArray(projects)) return [];
        const tags = new Set<string>();
        projects.forEach((p) => {
            if (p?.tags && Array.isArray(p.tags)) {
                p.tags.forEach((tag) => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    }, [projects]);

    useEffect(() => {
        clearFilters()
    }, [])

    // Read current filter state directly from store
    const activeTag = filters.tag;
    const showFeatured = filters.featured === true;

    // Filter handlers - these will trigger fetch via setFilter/clearFilters
    const handleShowAll = () => clearFilters();

    const handleToggleFeatured = () => {
        setFilter({ featured: !showFeatured ? true : null, tag: null });
    };

    const handleToggleTag = (tag: string) => {
        setFilter({ tag: activeTag === tag ? null : tag, featured: null });
    };

    const handleClearFilters = () => clearFilters();

    // Generate page numbers for pagination
    const getPageNumbers = () => {
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
    };

    if (isLoading && projects.length === 0) return <ProjectsSkeleton />;

    const filterKey = activeTag ?? (showFeatured ? "featured" : "all");

    return (
        <motion.div
            className="min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Hero Section */}
            <ProjectsHero />

            {/* Filters Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <ProjectsFilters
                    allTags={allTags}
                    activeTag={activeTag}
                    showFeatured={showFeatured}
                    onShowAll={handleShowAll}
                    onToggleFeatured={handleToggleFeatured}
                    onToggleTag={handleToggleTag}
                />
            </div>

            {/* Projects Grid or Empty State */}
            {projects.length > 0 ? (
                <>
                    <ProjectsGrid projects={projects} filterKey={filterKey} />

                    {/* Pagination Controls */}
                    {pagination && pagination.totalPages > 1 && (
                        <Pagination
                            pagination={pagination}
                            onNextPage={nextPage}
                            onPreviousPage={previousPage}
                            onGoToPage={goToPage}
                            getPageNumbers={getPageNumbers}
                            itemLabel="projects"
                        />
                    )}
                </>
            ) : (
                <ProjectsEmpty onClearFilters={handleClearFilters} />
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