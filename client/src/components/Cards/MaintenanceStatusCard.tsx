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
  "w-full border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary";

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
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Notes
          </label>
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
