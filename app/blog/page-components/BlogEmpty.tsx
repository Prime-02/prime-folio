// app/blog/page-components/BlogEmpty.tsx
import { motion } from "framer-motion";

interface BlogEmptyProps {
    onClearFilters: () => void;
}

export function BlogEmpty({ onClearFilters }: BlogEmptyProps) {
    return (
        <section className="w-full pb-16 md:pb-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <i
                        className="ti ti-search-off text-5xl mb-4 block"
                        style={{ color: "var(--text-muted)" }}
                        aria-hidden="true"
                    />
                    <h3
                        className="text-lg font-medium mb-2"
                        style={{ color: "var(--text-primary)" }}
                    >
                        No posts found
                    </h3>
                    <p
                        className="text-sm mb-6"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Try adjusting your filters or check back later for new posts.
                    </p>
                    <button
                        onClick={onClearFilters}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105"
                        style={{
                            background: "var(--primary-500)",
                            color: "white",
                            border: "none",
                        }}
                    >
                        <i className="ti ti-filter-off text-sm" aria-hidden="true" />
                        Clear filters
                    </button>
                </motion.div>
            </div>
        </section>
    );
}