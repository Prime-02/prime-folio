// app/blog/[slug]/page-components/BlogPostError.tsx
import Link from "next/link";

interface BlogPostErrorProps {
    error?: string | null;
}

export function BlogPostError({ error }: BlogPostErrorProps) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <i
                    className="ti ti-alert-circle text-5xl mb-4 block"
                    style={{ color: "var(--text-muted)" }}
                    aria-hidden="true"
                />
                <h2
                    className="text-xl font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                >
                    {error ?? "Post not found"}
                </h2>
                <p
                    className="text-sm mb-6"
                    style={{ color: "var(--text-muted)" }}
                >
                    The post you're looking for doesn't exist or has been removed.
                </p>
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105"
                    style={{
                        background: "var(--primary-500)",
                        color: "white",
                    }}
                >
                    <i className="ti ti-arrow-left text-sm" aria-hidden="true" />
                    View all posts
                </Link>
            </div>
        </div>
    );
}