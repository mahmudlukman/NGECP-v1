import { Save } from "lucide-react";

interface FormFooterProps {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  submittingLabel?: string;
}

const FormFooter = ({
  onCancel,
  isSubmitting,
  submitLabel = "Create report",
  submittingLabel = "Creating report...",
}: FormFooterProps) => {
  return (
    <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save size={16} />
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </div>
  );
};

export default FormFooter;
