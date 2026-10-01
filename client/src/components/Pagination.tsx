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
      className="mt-8 flex select-none items-center justify-center gap-1.5 font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-xs sm:text-sm"
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#0B1F1A]/10 bg-white px-3 font-medium text-[#0B1F1A]/70 shadow-xs transition-all hover:bg-[#0B1F1A]/[0.04] hover:text-[#0B1F1A] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "DOTS") {
            return (
              <span
                key={`dots-${index}`}
                className="flex h-9 w-8 items-center justify-center text-[#0B1F1A]/35"
              >
                <MoreHorizontal className="h-4 w-4" />
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
              className={`h-9 min-w-[36px] rounded-lg px-2.5 font-semibold transition-all ${
                isActive
                  ? "bg-[#0B1F1A] text-white shadow-[0_8px_18px_-8px_rgba(11,31,26,0.5)]"
                  : "border border-[#0B1F1A]/10 bg-white text-[#0B1F1A]/70 hover:bg-[#0B1F1A]/[0.04] hover:text-[#0B1F1A]"
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
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#0B1F1A]/10 bg-white px-3 font-medium text-[#0B1F1A]/70 shadow-xs transition-all hover:bg-[#0B1F1A]/[0.04] hover:text-[#0B1F1A] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

export default Pagination;
