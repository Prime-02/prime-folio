// components/ui/Pagination.tsx
import { motion } from "framer-motion";

interface PaginationProps {
    pagination: {
        page: number;
        totalPages: number;
        totalCount: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    onNextPage: () => void;
    onPreviousPage: () => void;
    onGoToPage: (page: number) => void;
    getPageNumbers: () => (number | string)[];
    itemLabel?: string; // e.g., "projects", "posts"
}

export function Pagination({
    pagination,
    onNextPage,
    onPreviousPage,
    onGoToPage,
    getPageNumbers,
    itemLabel = "items",
}: PaginationProps) {
    const pageNumbers = getPageNumbers();

    return (
        <motion.div
            className="w-full pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col items-center gap-4">
                    {/* Results count */}
                    <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Showing page {pagination.page} of {pagination.totalPages}{" "}
                        ({pagination.totalCount} total {itemLabel})
                    </p>

                    {/* Desktop pagination buttons */}
                    <div className="hidden sm:flex items-center gap-1">
                        {/* Previous button */}
                        <button
                            onClick={onPreviousPage}
                            disabled={!pagination.hasPreviousPage}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-opacity-80"
                            style={{
                                background: "var(--bg-secondary)",
                                color: "var(--text-secondary)",
                                border: "0.5px solid var(--border-light)",
                            }}
                            aria-label="Previous page"
                        >
                            <i className="ti ti-chevron-left text-xs" aria-hidden="true" />
                        </button>

                        {/* Page numbers */}
                        <div className="flex items-center gap-1">
                            {pageNumbers.map((page, index) => (
                                <div key={index}>
                                    {page === '...' ? (
                                        <span
                                            className="px-2 py-1.5 text-xs"
                                            style={{ color: "var(--text-muted)" }}
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => onGoToPage(page as number)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${page === pagination.page ? 'current' : ''
                                                }`}
                                            style={{
                                                background:
                                                    page === pagination.page
                                                        ? "var(--primary-500)"
                                                        : "var(--bg-secondary)",
                                                color:
                                                    page === pagination.page
                                                        ? "white"
                                                        : "var(--text-secondary)",
                                                border: "0.5px solid var(--border-light)",
                                            }}
                                            aria-label={`Go to page ${page}`}
                                            aria-current={page === pagination.page ? 'page' : undefined}
                                        >
                                            {page}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Next button */}
                        <button
                            onClick={onNextPage}
                            disabled={!pagination.hasNextPage}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-opacity-80"
                            style={{
                                background: "var(--bg-secondary)",
                                color: "var(--text-secondary)",
                                border: "0.5px solid var(--border-light)",
                            }}
                            aria-label="Next page"
                        >
                            <i className="ti ti-chevron-right text-xs" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Mobile-friendly simplified version */}
                    <div className="flex items-center gap-3 sm:hidden">
                        <button
                            onClick={onPreviousPage}
                            disabled={!pagination.hasPreviousPage}
                            className="text-xs font-medium px-4 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{
                                background: "var(--bg-secondary)",
                                color: "var(--text-secondary)",
                                border: "0.5px solid var(--border-light)",
                            }}
                        >
                            Previous
                        </button>
                        <span
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {pagination.page}/{pagination.totalPages}
                        </span>
                        <button
                            onClick={onNextPage}
                            disabled={!pagination.hasNextPage}
                            className="text-xs font-medium px-4 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{
                                background: "var(--bg-secondary)",
                                color: "var(--text-secondary)",
                                border: "0.5px solid var(--border-light)",
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}