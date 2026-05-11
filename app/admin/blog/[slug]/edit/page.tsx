// app/admin/blog/[slug]/edit/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePostStore } from "@/lib/stores/usePostStore";
import { SectionLoader } from "@/components/ui/Spinner";
import { Breadcrumb } from "@/components/ui/Misc";
import PostForm from "@/components/admin/blog/PostForm";

export default function EditPostPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;

    const { activePost, isLoading, error, fetchPostBySlug, clearActivePost } =
        usePostStore();

    useEffect(() => {
        if (slug) fetchPostBySlug(slug);
        return () => { clearActivePost(); };
    }, [slug, fetchPostBySlug, clearActivePost]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <SectionLoader message="Loading post…" />
                </div>
            </div>
        );
    }

    if (error || !activePost) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="mb-6 sm:mb-8">
                        <Breadcrumb
                            items={[
                                { label: "Admin", href: "/admin" },
                                { label: "Blog", href: "/admin/blog" },
                                { label: "Edit Post" },
                            ]}
                            className="mb-3"
                        />
                    </div>
                    <div className="text-center py-12">
                        <p className="text-lg text-[var(--text-muted)]">
                            {error || "Post not found"}
                        </p>
                        <button
                            onClick={() => router.push("/admin/blog")}
                            className="mt-4 text-sm text-[var(--primary-600)] hover:text-[var(--primary-700)]"
                        >
                            ← Back to posts
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <Breadcrumb
                        items={[
                            { label: "Admin", href: "/admin" },
                            { label: "Blog", href: "/admin/blog" },
                            { label: activePost.title },
                        ]}
                        className="mb-3"
                    />
                    <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                        Edit Post
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Editing: {activePost.title}
                    </p>
                </div>

                <PostForm post={activePost} isEditing={true} />
            </div>
        </div>
    );
}