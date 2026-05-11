// components/admin/blog/PostCard.tsx
"use client";

import { Pencil, Trash2, FileText, Calendar, Tag } from "lucide-react";
import type { Post } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import CloudinaryImage from "@/components/ui/CloudinaryImage";

interface PostCardProps {
    post: Post;
    onDelete: () => void;
}

function formatDate(dateStr: string | Date | null) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function PostCard({ post, onDelete }: PostCardProps) {
    const publishedDate = formatDate(post.publishedAt ?? post.createdAt);

    return (
        <div className="group relative flex flex-col sm:flex-row rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Cover Image — sidebar style for blog list */}
            <div className="relative w-full sm:w-48 h-36 sm:h-auto shrink-0 overflow-hidden bg-[var(--bg-tertiary)]">
                {post.coverImage ? (
                    <>
                        <CloudinaryImage
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                            <Link
                                href={`/admin/blog/${post.slug}/edit`}
                                className="p-2 rounded-lg bg-white/90 hover:bg-white text-[var(--text-primary)] transition-colors"
                                title="Edit post"
                            >
                                <Pencil size={15} />
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDelete();
                                }}
                                className="p-2 rounded-lg bg-white/90 hover:bg-red-50 text-[var(--text-primary)] hover:text-[var(--error-600)] transition-colors"
                                title="Delete post"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-full h-full bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] flex items-center justify-center">
                            <FileText size={36} className="text-[var(--text-muted)]" strokeWidth={1} />
                        </div>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                            <Link
                                href={`/admin/blog/${post.slug}/edit`}
                                className="p-2 rounded-lg bg-white/90 hover:bg-white text-[var(--text-primary)] transition-colors"
                                title="Edit post"
                            >
                                <Pencil size={15} />
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDelete();
                                }}
                                className="p-2 rounded-lg bg-white/90 hover:bg-red-50 text-[var(--text-primary)] hover:text-[var(--error-600)] transition-colors"
                                title="Delete post"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col p-4">
                {/* Title & Badges */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h2 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug">
                        {post.title}
                    </h2>
                    <div className="flex gap-1.5 shrink-0">
                        {!post.published && (
                            <Badge variant="warning" size="sm">
                                Draft
                            </Badge>
                        )}
                        {post.featured && (
                            <Badge variant="success" size="sm">
                                Featured
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Date */}
                {publishedDate && (
                    <div className="flex items-center gap-1.5 mb-2">
                        <Calendar size={12} className="text-[var(--text-muted)]" />
                        <span className="text-xs text-[var(--text-muted)]">
                            {post.published ? `Published ${publishedDate}` : `Created ${publishedDate}`}
                        </span>
                    </div>
                )}

                {/* Summary */}
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3 flex-1">
                    {post.summary}
                </p>

                {/* Tags & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
                    <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="default" size="sm">
                                {tag}
                            </Badge>
                        ))}
                        {post.tags.length > 3 && (
                            <Badge variant="default" size="sm">
                                +{post.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                    <Link
                        href={`/admin/blog/${post.slug}/edit`}
                        className="text-xs font-medium text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors shrink-0 ml-2"
                    >
                        Edit →
                    </Link>
                </div>
            </div>
        </div>
    );
}