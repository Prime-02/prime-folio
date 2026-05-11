export function AboutSkeleton() {
    return (
        <section className="w-full py-16 md:py-24" aria-label="Loading about">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="animate-pulse">
                    <div className="h-3 w-16 rounded-full mb-2" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="h-8 w-40 rounded-lg mb-2" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="h-0.5 w-10 rounded-full mb-10" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-10">
                        <div className="flex flex-col gap-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-4 rounded-lg" style={{ background: "var(--bg-tertiary)", width: i % 2 === 0 ? "100%" : "80%" }} />
                            ))}
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="h-32 rounded-xl" style={{ background: "var(--bg-tertiary)" }} />
                            <div className="h-24 rounded-xl" style={{ background: "var(--bg-tertiary)" }} />
                            <div className="h-16 rounded-xl" style={{ background: "var(--bg-tertiary)" }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}