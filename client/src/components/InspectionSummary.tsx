import { ClipboardCheck } from "lucide-react";

interface InspectionSummaryProps {
  generatorId?: string;
  brand?: string;
  model?: string;
}

const InspectionSummary = ({
  generatorId,
  brand,
  model,
}: InspectionSummaryProps) => {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl bg-[#0B1F1A] px-6 py-4 font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#F3F1EA] shadow-[0_20px_40px_-24px_rgba(11,31,26,0.5)]">
      <div className="flex shrink-0 items-center gap-2 text-[#7FD1AE]">
        <ClipboardCheck size={16} />
        <span className="text-xs font-medium uppercase tracking-wide">
          Inspecting
        </span>
      </div>
      <div>
        <p className="text-[11px] text-[#F3F1EA]/45">Generator ID</p>
        <p className="max-w-[180px] truncate font-mono text-sm font-medium">
          {generatorId || "—"}
        </p>
      </div>
      <div>
        <p className="text-[11px] text-[#F3F1EA]/45">Brand</p>
        <p className="text-sm font-medium">{brand || "—"}</p>
      </div>
      <div>
        <p className="text-[11px] text-[#F3F1EA]/45">Model</p>
        <p className="text-sm font-medium">{model || "—"}</p>
      </div>
    </div>
  );
};

export default InspectionSummary;
