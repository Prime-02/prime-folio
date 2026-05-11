"use client";

import { useEffect, useState, useCallback } from "react";
import { useContactStore } from "@/lib/stores/useContactStore";
import { useAuthStore } from "@/lib/stores";
import { SectionLoader } from "@/components/ui/Spinner";
import { Breadcrumb } from "@/components/ui/Misc";
import { Card, CardBody } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/Misc";
import { Pagination } from "@/components/ui/Pagination";
import { Search, Inbox } from "lucide-react";
import type { MessageStatus } from "@/lib/types";
import MessageCard from "@/components/admin/contact/MessageCard";
import MessageFilters from "@/components/admin/contact/MessageFilters";

export default function AdminContactPage() {
    const token = useAuthStore((s) => s.token);
    const {
        messages,
        isLoading,
        error,
        fetchMessages,
        updateMessageStatus,
        deleteMessage,
        isSubmitting,
        statusFilter,
        setStatusFilter,
        pagination,
        nextPage,
        previousPage,
        goToPage,
    } = useContactStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [updatingMessages, setUpdatingMessages] = useState<Set<string>>(new Set());

    // Fetch messages
    useEffect(() => {
        if (token) {
            fetchMessages({ token, status: statusFilter, page: 1 });
        }
    }, [token, statusFilter, fetchMessages]);

    // Get unread count
    const unreadCount = Array.isArray(messages)
        ? messages.filter((m) => m.status === "UNREAD").length
        : 0;
    const totalCount = pagination?.totalCount ?? 0;

    // Filter messages based on local search
    const filteredMessages = Array.isArray(messages)
        ? messages.filter((message) => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return (
                message.name.toLowerCase().includes(search) ||
                message.email.toLowerCase().includes(search) ||
                message.subject?.toLowerCase().includes(search) ||
                message.message.toLowerCase().includes(search)
            );
        })
        : [];

    const handleUpdateStatus = async (id: string, status: MessageStatus) => {
        if (!token) return;
        setUpdatingMessages((prev) => new Set(prev).add(id));
        await updateMessageStatus(token, id, status);
        setUpdatingMessages((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const handleDelete = async () => {
        if (!token || !deleteTarget) return;
        setUpdatingMessages((prev) => new Set(prev).add(deleteTarget));
        const success = await deleteMessage(token, deleteTarget);
        setUpdatingMessages((prev) => {
            const next = new Set(prev);
            next.delete(deleteTarget);
            return next;
        });
        if (success) {
            setDeleteTarget(null);
        }
    };

    const handleFilterChange = async (filter: MessageStatus | "ALL") => {
        if (!token) return;
        await setStatusFilter(token, filter);
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

        if (rangeStart > 2) pages.push('...');
        for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
        if (rangeEnd < totalPages - 1) pages.push('...');
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    }, [pagination]);

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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8">
                    <Breadcrumb
                        items={[
                            { label: "Admin", href: "/admin" },
                            { label: "Messages" },
                        ]}
                        className="mb-3"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                                Contact Messages
                            </h1>
                            <p className="text-sm text-[var(--text-muted)] mt-1">
                                Manage messages from your contact form
                                {pagination && ` (${pagination.totalCount} total)`}
                                {unreadCount > 0 && (
                                    <span
                                        className="ml-2 px-2 py-0.5 text-xs rounded-full"
                                        style={{
                                            background: "var(--warning-50)",
                                            color: "var(--warning-700)",
                                            border: "0.5px solid var(--warning-500)",
                                        }}
                                    >
                                        {unreadCount} unread
                                    </span>
                                )}
                            </p>
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
                <div className="mb-6 space-y-4">
                    <MessageFilters
                        currentFilter={statusFilter}
                        onChange={handleFilterChange}
                        unreadCount={unreadCount}
                        totalCount={totalCount}
                    />

                    {messages.length > 0 && (
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search messages by name, email, subject, or content..."
                            leftIcon={<Search size={16} />}
                        />
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <SectionLoader message="Loading messages…" />
                ) : filteredMessages.length === 0 ? (
                    <Card>
                        <CardBody>
                            <EmptyState
                                icon={<Inbox size={32} strokeWidth={1.5} />}
                                title={
                                    searchTerm
                                        ? "No messages found"
                                        : statusFilter !== "ALL"
                                            ? `No ${statusFilter.toLowerCase()} messages`
                                            : "No messages yet"
                                }
                                description={
                                    searchTerm
                                        ? "Try a different search term"
                                        : statusFilter !== "ALL"
                                            ? `There are no ${statusFilter.toLowerCase()} messages. Check other filters.`
                                            : "When visitors submit the contact form, their messages will appear here."
                                }
                            />
                        </CardBody>
                    </Card>
                ) : (
                    <>
                        <div className="space-y-3">
                            {filteredMessages.map((message) => (
                                <MessageCard
                                    key={message.id}
                                    message={message}
                                    onUpdateStatus={handleUpdateStatus}
                                    onDelete={(id) => setDeleteTarget(id)}
                                    isUpdating={updatingMessages.has(message.id)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && !searchTerm && (
                            <div className="mt-8">
                                <Pagination
                                    pagination={pagination}
                                    onNextPage={handleNextPage}
                                    onPreviousPage={handlePreviousPage}
                                    onGoToPage={handleGoToPage}
                                    getPageNumbers={getPageNumbers}
                                    itemLabel="messages"
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Delete Confirmation */}
                <ConfirmDialog
                    open={!!deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                    title="Delete Message"
                    message="Are you sure you want to delete this message? This action cannot be undone."
                    confirmLabel="Delete"
                    variant="danger"
                    loading={isSubmitting || (deleteTarget ? updatingMessages.has(deleteTarget) : false)}
                />
            </div>
        </div>
    );
}