import { ShieldCheck } from "lucide-react";
import FormCard from "./FormCard";
import type { IssueListData } from "../../@types";
import PassFailToggle from "../PassFailToggle";
import TagListField from "../Inputs/TagListField";

interface SafetyComplianceCardProps {
  value: IssueListData;
  onChange: (value: IssueListData) => void;
}

const inputClass =
  "w-full border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary";

const SafetyComplianceCard = ({
  value,
  onChange,
}: SafetyComplianceCardProps) => {
  const update = (patch: Partial<IssueListData>) =>
    onChange({ ...value, ...patch });

  const issues = value?.issues || [];

  return (
    <FormCard
      icon={ShieldCheck}
      title="Safety compliance"
      description="Safety issues found during inspection"
      action={
        <PassFailToggle
          value={value.passed}
          onChange={(passed) => update({ passed })}
        />
      }
    >
      <div className="space-y-4">
        <TagListField
          label="Issues"
          placeholder="Add safety issue..."
          items={issues}
          onAdd={(issue) => update({ issues: [...issues, issue] })}
          onRemove={(index) =>
            update({ issues: issues.filter((_, i) => i !== index) })
          }
          emptyText="No safety issues logged"
        />
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Notes
          </label>
          <textarea
            value={value.notes || ""}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Add any additional remarks about safety compliance..."
            className={`${inputClass} h-20 resize-none`}
          />
        </div>
      </div>
    </FormCard>
  );
};

export default SafetyComplianceCard;
