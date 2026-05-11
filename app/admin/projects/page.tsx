// app/admin/projects/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useProjectStore } from "@/lib/stores/useProjectStore";
import { useAuthStore } from "@/lib/stores";
import { SectionLoader } from "@/components/ui/Spinner";
import { Breadcrumb } from "@/components/ui/Misc";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/Misc";
import { Pagination } from "@/components/ui/Pagination";
import { Plus, Search, FolderOpen } from "lucide-react";
import Link from "next/link";
import ProjectCard from "@/components/admin/projects/ProjectCard";

export default function AdminProjectsPage() {
    const token = useAuthStore((s) => s.token);
    const {
        projects,
        isLoading,
        error,
        fetchProjects,
        deleteProject,
        isSubmitting,
        setFilter,
        pagination,
        nextPage,
        previousPage,
        goToPage
    } = useProjectStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    // Set showAll to true for admin view and fetch projects
    useEffect(() => {
        setFilter({ showAll: true });
        if (token) {
            fetchProjects(token);
        }
    }, [token, setFilter, fetchProjects]);

    // Filter projects based on local search (client-side filtering)
    const filteredProjects = Array.isArray(projects)
        ? projects.filter((project) => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return (
                project.title.toLowerCase().includes(search) ||
                project.summary.toLowerCase().includes(search) ||
                project.tags.some((tag) => tag.toLowerCase().includes(search))
            );
        })
        : [];

    const handleDelete = async () => {
        if (!token || !deleteTarget) return;
        const success = await deleteProject(token, deleteTarget);
        if (success) {
            setDeleteTarget(null);
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = useCallback(() => {
        if (!pagination) return [];

        const { page, totalPages } = pagination;
        const pages: (number | string)[] = [];
        const delta = 2;

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
    }, [pagination]);

    // Pagination handlers with token
    const handleNextPage = useCallback(() => {
        if (token) nextPage(token);
    }, [token, nextPage]);

    const handlePreviousPage = useCallback(() => {
        if (token) previousPage(token);
    }, [token, previousPage]);

    const handleGoToPage = useCallback((page: number) => {
        if (token) goToPage(page, token);
    }, [token, goToPage]);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8">
                    <Breadcrumb
                        items={[
                            { label: "Admin", href: "/admin" },
                            { label: "Projects" },
                        ]}
                        className="mb-3"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                                Projects
                            </h1>
                            <p className="text-sm text-[var(--text-muted)] mt-1">
                                Manage your portfolio projects
                                {pagination && ` (${pagination.totalCount} total)`}
                            </p>
                        </div>
                        <Link href="/admin/projects/new">
                            <Button
                                variant="primary"
                                size="md"
                                leftIcon={<Plus size={16} />}
                                className="w-full sm:w-auto"
                            >
                                New Project
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 px-4 py-3 rounded-xl border border-[var(--error-200)] bg-[var(--error-50)] text-sm text-[var(--error-700)]">
                        {error}
                    </div>
                )}

                {/* Search */}
                {projects.length > 0 && (
                    <div className="mb-6">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search projects by title, summary, or tags..."
                            leftIcon={<Search size={16} />}
                        />
                    </div>
                )}

                {/* Content */}
                {isLoading ? (
                    <SectionLoader message="Loading projects…" />
                ) : filteredProjects.length === 0 ? (
                    <Card>
                        <CardBody>
                            <EmptyState
                                icon={<FolderOpen size={32} strokeWidth={1.5} />}
                                title={searchTerm ? "No projects found" : "No projects yet"}
                                description={
                                    searchTerm
                                        ? "Try a different search term"
                                        : "Create your first project to showcase your work"
                                }
                                action={
                                    !searchTerm && (
                                        <Link href="/admin/projects/new">
                                            <Button variant="primary" size="sm">
                                                Create Project
                                            </Button>
                                        </Link>
                                    )
                                }
                            />
                        </CardBody>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onDelete={() => setDeleteTarget(project.slug)}
                                />
                            ))}
                        </div>

                        {/* Pagination - Using shared component */}
                        {pagination && pagination.totalPages > 1 && !searchTerm && (
                            <Pagination
                                pagination={pagination}
                                onNextPage={handleNextPage}
                                onPreviousPage={handlePreviousPage}
                                onGoToPage={handleGoToPage}
                                getPageNumbers={getPageNumbers}
                                itemLabel="projects"
                            />
                        )}
                    </>
                )}

                {/* Delete Confirmation */}
                <ConfirmDialog
                    open={!!deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                    title="Delete Project"
                    message="Are you sure you want to delete this project? This action cannot be undone."
                    confirmLabel="Delete"
                    variant="danger"
                    loading={isSubmitting}
                />
            </div>
        </div>
    );
}