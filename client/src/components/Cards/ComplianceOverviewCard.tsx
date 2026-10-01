import { Gauge } from "lucide-react";
import PassFailToggle from "../PassFailToggle";

interface ComplianceOverviewCardProps {
  overallCompliance: boolean;
  complianceScore: number;
  onComplianceChange: (value: boolean) => void;
  onScoreChange: (value: number) => void;
}

const scoreColor = (score: number) => {
  if (score >= 80) return "bg-[#16785A]";
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
    <section className="rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#0B1F1A]/45">
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

        <div className="min-w-[220px] flex-1">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-[#0B1F1A]/70">
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
                className="w-16 rounded-lg border border-[#0B1F1A]/15 px-2 py-1 text-right text-sm text-[#0B1F1A] outline-none focus:border-[#16785A] focus:ring-2 focus:ring-[#16785A]/20"
                required
              />
              <span className="text-sm text-[#0B1F1A]/40">/ 100</span>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#0B1F1A]/[0.06]">
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
