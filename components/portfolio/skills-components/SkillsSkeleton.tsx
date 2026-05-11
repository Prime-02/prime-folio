export function SkillsSkeleton() {
    return (
        <section className="w-full py-16 md:py-24" aria-label="Loading skills">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="animate-pulse">
                    <div className="h-3 w-16 rounded-full mb-2" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="h-8 w-40 rounded-lg mb-2" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="h-0.5 w-10 rounded-full mb-10" style={{ background: "var(--bg-tertiary)" }} />

                    {/* Categories */}
                    {[...Array(3)].map((_, catIndex) => (
                        <div key={catIndex} className="mb-8">
                            <div className="h-5 w-32 rounded-lg mb-4" style={{ background: "var(--bg-tertiary)" }} />
                            <div className="flex flex-wrap gap-3">
                                {[...Array(4)].map((_, skillIndex) => (
                                    <div
                                        key={skillIndex}
                                        className="h-16 w-40 rounded-xl"
                                        style={{ background: "var(--bg-tertiary)" }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}