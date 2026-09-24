import { Wind } from "lucide-react";
import FormCard from "./FormCard";
import type { EmissionsTestData } from "../../@types";
import PassFailToggle from "../PassFailToggle";

interface EmissionsTestCardProps {
  value: EmissionsTestData;
  onChange: (value: EmissionsTestData) => void;
}

const inputClass =
  "w-full border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary";

const EmissionsTestCard = ({ value, onChange }: EmissionsTestCardProps) => {
  const update = (patch: Partial<EmissionsTestData>) =>
    onChange({ ...value, ...patch });

  const handleNumberChange = (
    field: keyof EmissionsTestData,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value;
    update({
      [field]: val === "" ? 0 : Number(val),
    } as Partial<EmissionsTestData>);
  };

  return (
    <FormCard
      icon={Wind}
      title="Emissions test"
      description="CO2, NOx and particulate readings"
      action={
        <PassFailToggle
          value={value.passed}
          onChange={(passed) => update({ passed })}
        />
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              CO2 level (ppm)
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={value.co2Level ?? ""}
              onChange={(e) => handleNumberChange("co2Level", e)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              NOx level (ppm)
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={value.noxLevel ?? ""}
              onChange={(e) => handleNumberChange("noxLevel", e)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Particulate level (µg/m³)
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={value.particulateLevel ?? ""}
              onChange={(e) => handleNumberChange("particulateLevel", e)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Notes
          </label>
          <textarea
            value={value.notes || ""}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Add any additional remarks about emissions..."
            className={`${inputClass} h-20 resize-none`}
          />
        </div>
      </div>
    </FormCard>
  );
};

export default EmissionsTestCard;
