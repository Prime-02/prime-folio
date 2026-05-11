export function ProjectSkeleton() {
    return (
        <div className="min-h-screen animate-pulse">
            <div className="w-full h-[50vh]" style={{ background: "var(--bg-tertiary)" }} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <div className="h-4 w-24 rounded-full mb-4" style={{ background: "var(--bg-tertiary)" }} />
                <div className="h-10 w-3/4 rounded-lg mb-4" style={{ background: "var(--bg-tertiary)" }} />
                <div className="h-6 w-1/2 rounded-lg mb-6" style={{ background: "var(--bg-tertiary)" }} />
                <div className="flex gap-2 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-6 w-16 rounded-full" style={{ background: "var(--bg-tertiary)" }} />
                    ))}
                </div>
                <div className="space-y-3">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-4 rounded-lg" style={{ background: "var(--bg-tertiary)", width: i % 3 === 0 ? "100%" : "75%" }} />
                    ))}
                </div>
            </div>
        </div>
    );
}