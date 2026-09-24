import { Gauge } from "lucide-react";
import PassFailToggle from "../PassFailToggle";

interface ComplianceOverviewCardProps {
  overallCompliance: boolean;
  complianceScore: number;
  onComplianceChange: (value: boolean) => void;
  onScoreChange: (value: number) => void;
}

const scoreColor = (score: number) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
};

const ComplianceOverviewCard = ({
  overallCompliance,
  complianceScore,
  onComplianceChange,
  onScoreChange,
}: ComplianceOverviewCardProps) => {
  const clamped = Math.min(Math.max(complianceScore || 0, 0), 100);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      onScoreChange(0);
    } else {
      onScoreChange(Number(val));
    }
  };

  const handleBlur = () => {
    // Ensure value stays within bounds when leaving input
    const finalValue = Math.min(Math.max(complianceScore || 0, 0), 100);
    if (finalValue !== complianceScore) {
      onScoreChange(finalValue);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-2">
            <Gauge size={14} />
            Overall result
          </div>
          <PassFailToggle
            value={overallCompliance}
            onChange={onComplianceChange}
            passLabel="Compliant"
            failLabel="Non-Compliant"
          />
        </div>

        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-600">
              Compliance score
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                value={complianceScore}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-16 text-right border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                required
              />
              <span className="text-sm text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${scoreColor(
                clamped,
              )}`}
              style={{ width: `${clamped}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceOverviewCard;
