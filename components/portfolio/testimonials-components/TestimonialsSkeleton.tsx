export function TestimonialsSkeleton() {
    return (
        <section className="w-full py-16 md:py-24" aria-label="Loading testimonials">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="animate-pulse">
                    <div className="h-3 w-16 rounded-full mb-2" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="h-8 w-40 rounded-lg mb-2" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="h-0.5 w-10 rounded-full mb-10" style={{ background: "var(--bg-tertiary)" }} />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-xl p-6"
                                style={{
                                    background: "var(--bg-secondary)",
                                    border: "0.5px solid var(--bg-tertiary)",
                                }}
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="w-4 h-4 rounded" style={{ background: "var(--bg-tertiary)" }} />
                                    ))}
                                </div>
                                <div className="space-y-2 mb-6">
                                    <div className="h-3 w-full rounded" style={{ background: "var(--bg-tertiary)" }} />
                                    <div className="h-3 w-5/6 rounded" style={{ background: "var(--bg-tertiary)" }} />
                                    <div className="h-3 w-4/6 rounded" style={{ background: "var(--bg-tertiary)" }} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full" style={{ background: "var(--bg-tertiary)" }} />
                                    <div>
                                        <div className="h-3 w-24 rounded mb-1" style={{ background: "var(--bg-tertiary)" }} />
                                        <div className="h-2 w-32 rounded" style={{ background: "var(--bg-tertiary)" }} />
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