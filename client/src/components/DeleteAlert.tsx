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
    <div className="flex flex-col gap-4">
      {/* Alert Header / Visual Warning */}
      <div className="flex items-start gap-3.5 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-900">
        <div className="p-2 rounded-lg bg-rose-100 text-rose-600 flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-rose-950">{title}</h4>
          <p className="text-xs sm:text-sm text-rose-700/90 leading-relaxed">
            {content}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-2">
        {onCancel && (
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          disabled={isDeleting}
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] border border-rose-600 rounded-lg shadow-sm shadow-rose-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-60 disabled:pointer-events-none"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Deleting...</span>
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              <span>Delete Permanently</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
