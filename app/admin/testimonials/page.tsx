"use client";

import { useEffect, useState, useCallback } from "react";
import { useTestimonialStore, selectPendingCount } from "@/lib/stores/useTestimonialStore";
import { useAuthStore, useUploadStore } from "@/lib/stores";
import { SectionLoader } from "@/components/ui/Spinner";
import { Breadcrumb } from "@/components/ui/Misc";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/Misc";
import { Pagination } from "@/components/ui/Pagination";
import { Plus, Search, MessageSquare } from "lucide-react";
import Link from "next/link";
import TestimonialCard from "@/components/admin/testimonials/TestimonialCard";
import TestimonialFilters from "@/components/admin/testimonials/TestimonialFilters";
import { Testimonial } from "@prisma/client";

export default function AdminTestimonialsPage() {
    const token = useAuthStore((s) => s.token);
    const {
        adminTestimonials,
        isAdminLoading,
        error,
        fetchAdminTestimonials,
        approveTestimonial,
        featureTestimonial,
        deleteTestimonial,
        isSubmitting,
        adminFilter,
        setAdminFilter,
        adminPagination,
        adminNextPage,
        adminPreviousPage,
        adminGoToPage,
    } = useTestimonialStore();
    const { deleteFile } = useUploadStore()
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

    // Fetch admin testimonials
    useEffect(() => {
        if (token) {
            fetchAdminTestimonials({ token, filter: adminFilter, page: 1 });
        }
    }, [token, adminFilter, fetchAdminTestimonials]);

    // Filter testimonials based on local search (client-side filtering)
    const filteredTestimonials = Array.isArray(adminTestimonials)
        ? adminTestimonials.filter((testimonial) => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return (
                testimonial.name.toLowerCase().includes(search) ||
                testimonial.content.toLowerCase().includes(search) ||
                (testimonial.role?.toLowerCase().includes(search) ?? false) ||
                (testimonial.company?.toLowerCase().includes(search) ?? false)
            );
        })
        : [];

    const pendingCount = Array.isArray(adminTestimonials)
        ? adminTestimonials.filter((t) => !t.approved).length
        : 0;

    const totalCount = adminPagination?.totalCount ?? 0;

    const handleApprove = async (id: string) => {
        if (!token) return;
        await approveTestimonial(token, id);
    };

    const handleFeature = async (id: string, featured: boolean) => {
        if (!token) return;
        await featureTestimonial(token, id, featured);
    };

    const handleDelete = async () => {
        if (!token || !deleteTarget) return;
        if (deleteTarget.avatar) {
            await deleteFile(token, deleteTarget.avatar)
        }
        const success = await deleteTestimonial(token, deleteTarget.id);
        if (success) {
            setDeleteTarget(null);
        }
    };

    const handleFilterChange = async (filter: typeof adminFilter) => {
        if (!token) return;
        await setAdminFilter(token, filter);
    };

    // Generate page numbers for pagination
    const getPageNumbers = useCallback(() => {
        if (!adminPagination) return [];

        const { page, totalPages } = adminPagination;
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
    }, [adminPagination]);

    // Pagination handlers with token
    const handleNextPage = useCallback(() => {
        if (token) adminNextPage(token);
    }, [token, adminNextPage]);

    const handlePreviousPage = useCallback(() => {
        if (token) adminPreviousPage(token);
    }, [token, adminPreviousPage]);

    const handleGoToPage = useCallback((page: number) => {
        if (token) adminGoToPage(page, token);
    }, [token, adminGoToPage]);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8">
                    <Breadcrumb
                        items={[
                            { label: "Admin", href: "/admin" },
                            { label: "Testimonials" },
                        ]}
                        className="mb-3"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                                Testimonials
                            </h1>
                            <p className="text-sm text-[var(--text-muted)] mt-1">
                                Manage client testimonials and reviews
                                {adminPagination && ` (${adminPagination.totalCount} total)`}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/admin/testimonials/new">
                                <Button
                                    variant="primary"
                                    size="md"
                                    leftIcon={<Plus size={16} />}
                                    className="w-full sm:w-auto"
                                >
                                    New Testimonial
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 px-4 py-3 rounded-xl border border-[var(--error-200)] bg-[var(--error-50)] text-sm text-[var(--error-700)]">
                        {error}
                    </div>
                )}

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <TestimonialFilters
                        currentFilter={adminFilter}
                        onChange={handleFilterChange}
                        pendingCount={pendingCount}
                        totalCount={totalCount}
                    />

                    {adminTestimonials.length > 0 && (
                        <div className="w-full sm:w-72">
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search testimonials..."
                                leftIcon={<Search size={16} />}
                            />
                        </div>
                    )}
                </div>

                {/* Content */}
                {isAdminLoading ? (
                    <SectionLoader message="Loading testimonials…" />
                ) : filteredTestimonials.length === 0 ? (
                    <Card>
                        <CardBody>
                            <EmptyState
                                icon={<MessageSquare size={32} strokeWidth={1.5} />}
                                title={
                                    searchTerm
                                        ? "No testimonials found"
                                        : adminFilter !== "all"
                                            ? `No ${adminFilter} testimonials`
                                            : "No testimonials yet"
                                }
                                description={
                                    searchTerm
                                        ? "Try a different search term"
                                        : adminFilter !== "all"
                                            ? `There are no ${adminFilter} testimonials. Check other filters or wait for new submissions.`
                                            : "When visitors submit testimonials, they'll appear here for your review."
                                }
                                action={
                                    !searchTerm && adminFilter === "all" && (
                                        <Link href="/admin/testimonials/new">
                                            <Button variant="primary" size="sm">
                                                Add Testimonial
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
                            {filteredTestimonials.map((testimonial) => (
                                <TestimonialCard
                                    key={testimonial.id}
                                    testimonial={testimonial}
                                    onApprove={handleApprove}
                                    onFeature={handleFeature}
                                    onDelete={(id) => setDeleteTarget(testimonial)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {adminPagination && adminPagination.totalPages > 1 && !searchTerm && (
                            <Pagination
                                pagination={adminPagination}
                                onNextPage={handleNextPage}
                                onPreviousPage={handlePreviousPage}
                                onGoToPage={handleGoToPage}
                                getPageNumbers={getPageNumbers}
                                itemLabel="testimonials"
                            />
                        )}
                    </>
                )}

                {/* Delete Confirmation */}
                <ConfirmDialog
                    open={!!deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                    title="Delete Testimonial"
                    message="Are you sure you want to delete this testimonial? This action cannot be undone."
                    confirmLabel="Delete"
                    variant="danger"
                    loading={isSubmitting}
                />

                {/* Approve Confirmation - Only show for pending testimonials */}
                {filteredTestimonials.some((t) => !t.approved) && (
                    <div className="mt-6">
                        <Card>
                            <CardBody>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-[var(--text-primary)]">
                                            {pendingCount} pending {pendingCount === 1 ? "testimonial" : "testimonials"}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                            Approve testimonials to display them publicly
                                        </p>
                                    </div>
                                    {pendingCount > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                filteredTestimonials
                                                    .filter((t) => !t.approved)
                                                    .forEach((t) => handleApprove(t.id));
                                            }}
                                        >
                                            Approve All
                                        </Button>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}