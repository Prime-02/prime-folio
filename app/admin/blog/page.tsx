// app/admin/blog/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { usePostStore } from "@/lib/stores/usePostStore";
import { useAuthStore } from "@/lib/stores";
import { SectionLoader } from "@/components/ui/Spinner";
import { Breadcrumb, EmptyState } from "@/components/ui/Misc";
import { Card, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { Plus, Search, FileText } from "lucide-react";
import Link from "next/link";
import PostCard from "@/components/admin/blog/PostCard";

export default function AdminBlogPage() {
  const token = useAuthStore((s) => s.token);
  const {
    posts,
    isLoading,
    error,
    fetchPosts,
    deletePost,
    isSubmitting,
    setFilter,
    pagination,
    nextPage,
    previousPage,
    goToPage
  } = usePostStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Set showAll for admin and fetch
  useEffect(() => {
    setFilter({ showAll: true });
  }, [setFilter]);

  useEffect(() => {
    if (token) {
      fetchPosts(token);
    }
  }, [token, fetchPosts]);

  // Filter posts based on local search (client-side filtering)
  const filteredPosts = Array.isArray(posts)
    ? posts.filter((post) => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(s) ||
        post.summary.toLowerCase().includes(s) ||
        post.tags.some((t) => t.toLowerCase().includes(s))
      );
    })
    : [];

  const handleDelete = async () => {
    if (!token || !deleteTarget) return;
    const success = await deletePost(token, deleteTarget);
    if (success) setDeleteTarget(null);
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
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Breadcrumb
            items={[
              { label: "Admin", href: "/admin" },
              { label: "Blog" },
            ]}
            className="mb-3"
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                Blog
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Manage your blog posts
                {pagination && ` (${pagination.totalCount} total)`}
              </p>
            </div>
            <Link href="/admin/blog/new">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus size={16} />}
                className="w-full sm:w-auto"
              >
                New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl border border-[var(--error-200)] bg-[var(--error-50)] text-sm text-[var(--error-700)]">
            {error}
          </div>
        )}

        {/* Search */}
        {posts.length > 0 && (
          <div className="mb-6">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts by title, summary, or tags..."
              leftIcon={<Search size={16} />}
            />
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <SectionLoader message="Loading posts…" />
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                icon={<FileText size={32} strokeWidth={1.5} />}
                title={searchTerm ? "No posts found" : "No posts yet"}
                description={
                  searchTerm
                    ? "Try a different search term"
                    : "Write your first blog post"
                }
                action={
                  !searchTerm && (
                    <Link href="/admin/blog/new">
                      <Button variant="primary" size="sm">
                        Create Post
                      </Button>
                    </Link>
                  )
                }
              />
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:gap-4">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={() => setDeleteTarget(post.slug)}
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
                itemLabel="posts"
              />
            )}
          </>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          confirmLabel="Delete"
          variant="danger"
          loading={isSubmitting}
        />
      </div>
    </div>
  );
}