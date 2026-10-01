import React from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

interface DeleteAlertProps {
  content: string;
  onDelete: () => void;
  onCancel?: () => void;
  title?: string;
  isDeleting?: boolean;
}

const DeleteAlert: React.FC<DeleteAlertProps> = ({
  content,
  onDelete,
  onCancel,
  title = "Confirm Deletion",
  isDeleting = false,
}) => {
  return (
    <div className="flex flex-col gap-4 font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
      {/* Alert Header / Visual Warning */}
      <div className="flex items-start gap-3.5 rounded-xl border border-rose-100 bg-rose-50 p-4 text-rose-900">
        <div className="flex-shrink-0 rounded-lg bg-rose-100 p-2 text-rose-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-rose-950">{title}</h4>
          <p className="text-xs leading-relaxed text-rose-700/90 sm:text-sm">
            {content}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-2 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="rounded-lg border border-[#0B1F1A]/15 bg-white px-4 py-2 text-xs font-medium text-[#0B1F1A]/70 transition-colors hover:bg-[#0B1F1A]/[0.04] focus:outline-none focus:ring-2 focus:ring-[#0B1F1A]/15 disabled:opacity-50 sm:text-sm"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          disabled={isDeleting}
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-600 bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-rose-600/20 transition-all hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 sm:text-sm"
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Deleting...</span>
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              <span>Delete Permanently</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
