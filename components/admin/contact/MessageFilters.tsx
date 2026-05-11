"use client";

import { motion } from "framer-motion";
import type { MessageStatus } from "@/lib/types";

type FilterOption = MessageStatus | "ALL";

interface MessageFiltersProps {
    currentFilter: FilterOption;
    onChange: (filter: FilterOption) => void;
    unreadCount: number;
    totalCount: number;
}

export default function MessageFilters({
    currentFilter,
    onChange,
    unreadCount,
    totalCount,
}: MessageFiltersProps) {
    const filters: { value: FilterOption; label: string; icon: string; count: number }[] = [
        {
            value: "ALL",
            label: "All",
            icon: "ti-mail",
            count: totalCount
        },
        {
            value: "UNREAD",
            label: "Unread",
            icon: "ti-mail-opened",
            count: unreadCount
        },
        {
            value: "READ",
            label: "Read",
            icon: "ti-mail-check",
            count: totalCount - unreadCount
        },
        {
            value: "REPLIED",
            label: "Replied",
            icon: "ti-mail-forward",
            count: 0
        },
        {
            value: "ARCHIVED",
            label: "Archived",
            icon: "ti-archive",
            count: 0
        },
    ];

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
                <motion.button
                    key={filter.value}
                    onClick={() => onChange(filter.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-2 whitespace-nowrap shrink-0 ${currentFilter === filter.value
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
                    <i className={`ti ${filter.icon} text-xs`} aria-hidden="true" />
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