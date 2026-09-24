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
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 bg-emerald-600 text-slate-100 rounded-2xl px-6 py-4 mb-6 shadow-sm">
      <div className="flex items-center gap-2 text-slate-300 shrink-0">
        <ClipboardCheck size={16} />
        <span className="text-xs font-medium uppercase tracking-wide">
          Inspecting
        </span>
      </div>
      <div>
        <p className="text-[11px] text-slate-400">Generator ID</p>
        <p className="text-sm font-medium font-mono truncate max-w-[180px]">
          {generatorId || "—"}
        </p>
      </div>
      <div>
        <p className="text-[11px] text-slate-400">Brand</p>
        <p className="text-sm font-medium">{brand || "—"}</p>
      </div>
      <div>
        <p className="text-[11px] text-slate-400">Model</p>
        <p className="text-sm font-medium">{model || "—"}</p>
      </div>
    </div>
  );
};

export default InspectionSummary;
