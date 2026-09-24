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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto bg-slate-900/60 backdrop-blur-md transition-all duration-200 animate-in fade-in"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-slate-100/80 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] transform transition-all animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()} // Prevent click-through closing when clicking modal content
      >
        {/* Modal Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {title}
            </h3>

            <div className="flex items-center gap-3">
              {showActionBtn && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-sm transition-colors"
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
          className="absolute top-3.5 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onClick={onClose}
        >
          <svg
            className="w-4 h-4"
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
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
