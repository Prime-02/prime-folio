// app/blog/[slug]/page-components/BlogPostSkeleton.tsx

export function BlogPostSkeleton() {
    return (
        <div className="min-h-screen animate-pulse">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                <div className="h-4 w-24 rounded-full mb-4" style={{ background: "var(--bg-tertiary)" }} />
                <div className="h-10 w-3/4 rounded-lg mb-4" style={{ background: "var(--bg-tertiary)" }} />
                <div className="flex gap-4 mb-6">
                    <div className="h-4 w-32 rounded-lg" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="h-4 w-24 rounded-lg" style={{ background: "var(--bg-tertiary)" }} />
                </div>
                <div className="flex gap-2 mb-8">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-6 w-16 rounded-full"
                            style={{ background: "var(--bg-tertiary)" }}
                        />
                    ))}
                </div>
                <div className="h-64 w-full rounded-xl mb-8" style={{ background: "var(--bg-tertiary)" }} />
                <div className="space-y-3">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="h-4 rounded-lg"
                            style={{
                                background: "var(--bg-tertiary)",
                                width: i % 3 === 0 ? "100%" : "75%",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}