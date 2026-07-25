import React, { useMemo } from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    className?: string;
}

const ELLIPSIS = "…" as const;
type PageItem = number | typeof ELLIPSIS;

function buildPageRange(
    currentPage: number,
    totalPages: number,
    siblingCount: number
): PageItem[] {
    const totalNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftIndex = Math.max(currentPage - siblingCount, 1);
    const rightIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftIndex > 2;
    const showRightEllipsis = rightIndex < totalPages - 1;

    const pages: PageItem[] = [1];

    if (showLeftEllipsis) pages.push(ELLIPSIS);
    for (
        let p = leftIndex === 1 ? 2 : leftIndex;
        p <= (rightIndex === totalPages ? totalPages - 1 : rightIndex);
        p++
    ) {
        if (p > 1 && p < totalPages) pages.push(p);
    }
    if (showRightEllipsis) pages.push(ELLIPSIS);

    pages.push(totalPages);
    return pages;
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          currentPage,
                                                          totalPages,
                                                          onPageChange,
                                                          siblingCount = 1,
                                                          className = "",
                                                      }) => {
    const pages = useMemo(
        () => buildPageRange(currentPage, totalPages, siblingCount),
        [currentPage, totalPages, siblingCount]
    );

    if (totalPages <= 1) return null;

    const goTo = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onPageChange(page);
    };

    return (
        <nav aria-label="Pagination" className={`flex items-center justify-center gap-6 ${className}`}>
            <button
                type="button" aria-label="Previous page"
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-slate-500 transition-colors hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-slate-500">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </button>

            {pages.map((page, idx) =>
                    page === ELLIPSIS ? (
                        <span key={`ellipsis-${idx}`} className="text-sm text-slate-600">
            {ELLIPSIS}
          </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            onClick={() => goTo(page)}
                            aria-current={page === currentPage ? "page" : undefined}
                            className="group relative pb-2 text-sm"
                        >
            <span
                className={
                    page === currentPage
                        ? "font-semibold text-teal-400"
                        : "text-slate-500 transition-colors group-hover:text-slate-200"
                }>
              {page}
            </span>
                            {page === currentPage && (
                                <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-teal-400" />
                            )}
                        </button>
                    )
            )}

            <button type="button" aria-label="Next page"
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-slate-500 transition-colors hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-slate-500"
            >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                </svg>
            </button>
        </nav>
    );
};

export default Pagination;