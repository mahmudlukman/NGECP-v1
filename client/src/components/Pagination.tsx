import type { FC } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Helper to generate page range array with ellipsis dots
  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "DOTS", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      return [firstPageIndex, "DOTS", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [firstPageIndex, "DOTS", ...middleRange, "DOTS", lastPageIndex];
    }

    return [];
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Pagination Navigation"
      className="flex items-center justify-center gap-1.5 mt-8 text-xs sm:text-sm select-none"
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "DOTS") {
            return (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center h-9 w-8 text-slate-400"
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = currentPage === pageNum;

          return (
            <button
              type="button"
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Page ${pageNum}`}
              className={`h-9 min-w-[36px] px-2.5 rounded-lg font-semibold transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;
