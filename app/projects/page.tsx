// page.tsx
"use client";

import { useProjectStore } from "@/lib/stores";
import { useEffect, useMemo, useState } from "react";
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
        fetchProjects,
        projects,
        isLoading,
        pagination,
        nextPage,
        previousPage,
        goToPage,
        setFilter,
        clearFilters: clearStoreFilters
    } = useProjectStore();

    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [showFeatured, setShowFeatured] = useState<boolean>(false);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Get all unique tags - safely handle if projects is not an array
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

    // Ensure projects is always an array
    const safeProjects = useMemo(() => {
        return Array.isArray(projects) ? projects : [];
    }, [projects]);

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
    const getPageNumbers = () => {
        if (!pagination) return [];

        const { page, totalPages } = pagination;
        const pages: (number | string)[] = [];
        const delta = 2; // Number of pages to show on each side of current page

        // Always show first page
        pages.push(1);

        // Calculate range
        const rangeStart = Math.max(2, page - delta);
        const rangeEnd = Math.min(totalPages - 1, page + delta);

        // Add ellipsis after first page if needed
        if (rangeStart > 2) {
            pages.push('...');
        }

        // Add pages in range
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }

        // Add ellipsis before last page if needed
        if (rangeEnd < totalPages - 1) {
            pages.push('...');
        }

        // Always show last page if there's more than 1 page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    if (isLoading && safeProjects.length === 0) return <ProjectsSkeleton />;

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
            {safeProjects.length > 0 ? (
                <>
                    <ProjectsGrid projects={safeProjects} filterKey={filterKey} />

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