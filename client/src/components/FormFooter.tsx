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
    <div className="flex justify-end gap-3 border-t border-[#0B1F1A]/10 pt-6 font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="cursor-pointer rounded-lg border border-[#0B1F1A]/15 px-6 py-2.5 text-sm font-medium text-[#0B1F1A]/70 transition-colors hover:bg-[#0B1F1A]/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#0B1F1A] px-6 py-2.5 text-sm font-medium text-[#F3F1EA] shadow-[0_10px_25px_-14px_rgba(11,31,26,0.6)] transition-colors hover:bg-[#12332b] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save size={16} />
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </div>
  );
};

export default FormFooter;
