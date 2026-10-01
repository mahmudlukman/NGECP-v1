import React, { useEffect } from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  hideHeader?: boolean;
  showActionBtn?: boolean;
  actionBtnIcon?: React.ReactNode;
  actionBtnText?: string;
  onActionClick?: () => void;
  maxWidth?: string; // Optional custom max-width override (e.g. "max-w-2xl")
}

const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader = false,
  showActionBtn = false,
  actionBtnIcon = null,
  actionBtnText,
  onActionClick,
  maxWidth = "max-w-xl",
}) => {
  // Close on Escape key press & prevent background scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-[#0B1F1A]/70 p-4 backdrop-blur-md transition-all duration-200 sm:p-6"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className={`animate-in zoom-in-95 relative flex w-full ${maxWidth} max-h-[90vh] transform flex-col overflow-hidden rounded-2xl border border-[#0B1F1A]/10 bg-white font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-[0_40px_80px_-20px_rgba(11,31,26,0.45)] transition-all duration-200 sm:max-h-[85vh]`}
        onClick={(e) => e.stopPropagation()} // Prevent click-through closing when clicking modal content
      >
        {/* Modal Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between border-b border-[#0B1F1A]/10 bg-[#F7F6F1] px-6 py-4">
            <h3 className="font-[Newsreader,Georgia,serif] text-lg font-normal tracking-tight text-[#0B1F1A] sm:text-xl">
              {title}
            </h3>

            <div className="flex items-center gap-3">
              {showActionBtn && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#0B1F1A]/10 bg-white px-3 py-1.5 text-xs font-medium text-[#0B1F1A]/75 shadow-sm transition-colors hover:bg-[#0B1F1A]/[0.04] hover:text-[#0B1F1A]"
                  onClick={() => onActionClick?.()}
                >
                  {actionBtnIcon}
                  <span>{actionBtnText}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          aria-label="Close modal"
          className="absolute right-4 top-3.5 z-10 rounded-full p-2 text-[#0B1F1A]/40 transition-colors hover:bg-[#0B1F1A]/[0.06] hover:text-[#0B1F1A] focus:outline-none focus:ring-2 focus:ring-[#16785A]/40"
          onClick={onClose}
        >
          <svg
            className="h-4 w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>

        {/* Modal Body (Scrollable Content) */}
        <div className="scrollbar-thin scrollbar-thumb-[#0B1F1A]/15 scrollbar-track-transparent flex-1 overflow-y-auto p-6 text-[#0B1F1A]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
