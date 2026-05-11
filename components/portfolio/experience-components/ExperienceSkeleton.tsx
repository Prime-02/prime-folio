export function ExperienceSkeleton() {
    return (
        <section className="w-full py-16 md:py-24" aria-label="Loading experience">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="animate-pulse">
                    <div className="h-3 w-16 rounded-full mb-2" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="h-8 w-40 rounded-lg mb-2" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="h-0.5 w-10 rounded-full mb-10" style={{ background: "var(--bg-tertiary)" }} />

                    {/* Timeline items */}
                    <div className="relative pl-8">
                        {/* Timeline line */}
                        <div
                            className="absolute left-[11px] top-2 bottom-2 w-0.5"
                            style={{ background: "var(--bg-tertiary)" }}
                        />

                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="mb-8 last:mb-0 relative">
                                {/* Timeline dot */}
                                <div
                                    className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2"
                                    style={{
                                        background: "var(--bg-secondary)",
                                        borderColor: "var(--bg-tertiary)"
                                    }}
                                />

                                <div className="rounded-xl p-5" style={{
                                    background: "var(--bg-secondary)",
                                    border: "0.5px solid var(--bg-tertiary)"
                                }}>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg" style={{ background: "var(--bg-tertiary)" }} />
                                        <div className="flex-1">
                                            <div className="h-5 w-48 rounded-lg mb-2" style={{ background: "var(--bg-tertiary)" }} />
                                            <div className="h-4 w-32 rounded-lg mb-3" style={{ background: "var(--bg-tertiary)" }} />
                                            <div className="h-4 w-full rounded-lg mb-2" style={{ background: "var(--bg-tertiary)" }} />
                                            <div className="h-4 w-3/4 rounded-lg" style={{ background: "var(--bg-tertiary)" }} />
                                        </div>
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