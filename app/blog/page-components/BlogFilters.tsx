// app/blog/page-components/BlogFilters.tsx
import { motion, type Variants } from "framer-motion";

const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
};

interface BlogFiltersProps {
    allTags: string[];
    activeTag: string | null;
    showFeatured: boolean;
    onShowAll: () => void;
    onToggleFeatured: () => void;
    onToggleTag: (tag: string) => void;
}

export function BlogFilters({
    allTags,
    activeTag,
    showFeatured,
    onShowAll,
    onToggleFeatured,
    onToggleTag,
}: BlogFiltersProps) {
    return (
        <motion.div
            className="flex flex-col items-center gap-4 mb-8 max-w-2xl mx-auto"
            variants={headerVariants}
        >
            {/* Primary filters row */}
            <div className="flex items-center gap-2">
                {/* All filter */}
                <button
                    onClick={onShowAll}
                    className="text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
                    style={{
                        background: !showFeatured && !activeTag ? "var(--primary-500)" : "var(--bg-secondary)",
                        color: !showFeatured && !activeTag ? "white" : "var(--text-secondary)",
                        border: "0.5px solid var(--border-light)",
                    }}
                >
                    All
                </button>

                {/* Featured filter */}
                <button
                    onClick={onToggleFeatured}
                    className="text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
                    style={{
                        background: showFeatured ? "var(--primary-500)" : "var(--bg-secondary)",
                        color: showFeatured ? "white" : "var(--text-secondary)",
                        border: "0.5px solid var(--border-light)",
                    }}
                >
                    <i className="ti ti-star text-xs mr-1" aria-hidden="true" />
                    Featured
                </button>

                {/* Divider */}
                {allTags.length > 0 && (
                    <div
                        className="w-px h-4 mx-1 hidden sm:block"
                        style={{ background: "var(--border-color)" }}
                    />
                )}
            </div>

            {/* Tags container */}
            {allTags.length > 0 && (
                <div className="w-full">
                    <div className="flex flex-wrap justify-center gap-1.5 px-1">
                        {allTags.map((tag) => (
                            <motion.button
                                key={tag}
                                onClick={() => onToggleTag(tag)}
                                className="text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-1 rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0"
                                style={{
                                    background: activeTag === tag ? "var(--primary-500)" : "var(--bg-secondary)",
                                    color: activeTag === tag ? "white" : "var(--text-muted)",
                                    border: "0.5px solid var(--border-light)",
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {tag}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}