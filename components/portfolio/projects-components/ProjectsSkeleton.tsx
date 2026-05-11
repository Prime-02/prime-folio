export function ProjectsSkeleton() {
    return (
        <section className="w-full py-16 md:py-24" aria-label="Loading projects">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="animate-pulse">
                    <div className="h-3 w-16 rounded-full mb-2" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="h-8 w-40 rounded-lg mb-2" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="h-0.5 w-10 rounded-full mb-10" style={{ background: "var(--bg-tertiary)" }} />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-xl overflow-hidden"
                                style={{
                                    background: "var(--bg-secondary)",
                                    border: "0.5px solid var(--bg-tertiary)"
                                }}
                            >
                                <div className="h-48" style={{ background: "var(--bg-tertiary)" }} />
                                <div className="p-5">
                                    <div className="h-5 w-3/4 rounded-lg mb-3" style={{ background: "var(--bg-tertiary)" }} />
                                    <div className="h-4 w-full rounded-lg mb-2" style={{ background: "var(--bg-tertiary)" }} />
                                    <div className="h-4 w-2/3 rounded-lg mb-4" style={{ background: "var(--bg-tertiary)" }} />
                                    <div className="flex gap-2">
                                        <div className="h-6 w-16 rounded-full" style={{ background: "var(--bg-tertiary)" }} />
                                        <div className="h-6 w-16 rounded-full" style={{ background: "var(--bg-tertiary)" }} />
                                        <div className="h-6 w-16 rounded-full" style={{ background: "var(--bg-tertiary)" }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}