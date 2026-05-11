// app/admin/blog/new/page.tsx
"use client";

import { Breadcrumb } from "@/components/ui/Misc";
import PostForm from "@/components/admin/blog/PostForm";

export default function NewPostPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <Breadcrumb
                        items={[
                            { label: "Admin", href: "/admin" },
                            { label: "Blog", href: "/admin/blog" },
                            { label: "New Post" },
                        ]}
                        className="mb-3"
                    />
                    <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                        New Post
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Write a new blog post
                    </p>
                </div>

                <PostForm />
            </div>
        </div>
    );
}