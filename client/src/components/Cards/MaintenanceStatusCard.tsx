import { Wrench } from "lucide-react";
import FormCard from "./FormCard";
import type { IssueListData } from "../../@types";
import PassFailToggle from "../PassFailToggle";
import TagListField from "../Inputs/TagListField";

interface MaintenanceStatusCardProps {
  value: IssueListData;
  onChange: (value: IssueListData) => void;
}

const inputClass =
  "w-full border border-[#0B1F1A]/15 text-[#0B1F1A] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#16785A]/20 focus:border-[#16785A]";

const labelClass = "block text-sm font-medium text-[#0B1F1A]/70 mb-2";

const MaintenanceStatusCard = ({
  value,
  onChange,
}: MaintenanceStatusCardProps) => {
  const update = (patch: Partial<IssueListData>) =>
    onChange({ ...value, ...patch });

  const issues = value?.issues || [];

  return (
    <FormCard
      icon={Wrench}
      title="Maintenance status"
      description="Outstanding issues found during inspection"
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
          placeholder="Add maintenance issue..."
          items={issues}
          onAdd={(issue) => update({ issues: [...issues, issue] })}
          onRemove={(index) =>
            update({ issues: issues.filter((_, i) => i !== index) })
          }
          emptyText="No maintenance issues logged"
        />
        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            value={value.notes || ""}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Add any additional remarks about maintenance status..."
            className={`${inputClass} h-20 resize-none`}
          />
        </div>
      </div>
    </FormCard>
  );
};

export default MaintenanceStatusCard;
