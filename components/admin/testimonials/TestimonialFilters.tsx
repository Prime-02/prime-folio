"use client";

import { motion } from "framer-motion";

type AdminFilter = "all" | "pending" | "approved";

interface TestimonialFiltersProps {
    currentFilter: AdminFilter;
    onChange: (filter: AdminFilter) => void;
    pendingCount: number;
    totalCount: number;
}

export default function TestimonialFilters({
    currentFilter,
    onChange,
    pendingCount,
    totalCount,
}: TestimonialFiltersProps) {
    const filters: { value: AdminFilter; label: string; count: number }[] = [
        { value: "all", label: "All", count: totalCount },
        { value: "pending", label: "Pending", count: pendingCount },
        { value: "approved", label: "Approved", count: totalCount - pendingCount },
    ];

    return (
        <div className="flex items-center gap-2">
            {filters.map((filter) => (
                <motion.button
                    key={filter.value}
                    onClick={() => onChange(filter.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-2 ${currentFilter === filter.value
                            ? "text-white"
                            : "hover:bg-[var(--bg-tertiary)]"
                        }`}
                    style={{
                        background:
                            currentFilter === filter.value
                                ? "var(--primary-500)"
                                : "var(--bg-secondary)",
                        color:
                            currentFilter === filter.value
                                ? "white"
                                : "var(--text-secondary)",
                        border: "0.5px solid var(--border-light)",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {filter.label}
                    <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${currentFilter === filter.value
                                ? "bg-white/20"
                                : "bg-[var(--bg-tertiary)]"
                            }`}
                    >
                        {filter.count}
                    </span>
                </motion.button>
            ))}
        </div>
    );
}