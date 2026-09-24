import { Volume2 } from "lucide-react";
import FormCard from "./FormCard";
import type { NoiseLevelData } from "../../@types";
import PassFailToggle from "../PassFailToggle";

interface NoiseLevelCardProps {
  value: NoiseLevelData;
  onChange: (value: NoiseLevelData) => void;
}

const inputClass =
  "w-full border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary";

const NoiseLevelCard = ({ value, onChange }: NoiseLevelCardProps) => {
  const update = (patch: Partial<NoiseLevelData>) =>
    onChange({ ...value, ...patch });

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    update({ decibelReading: val === "" ? 0 : Number(val) });
  };

  return (
    <FormCard
      icon={Volume2}
      title="Noise level test"
      description="Decibel reading at the standard test distance"
      action={
        <PassFailToggle
          value={value.passed}
          onChange={(passed) => update({ passed })}
        />
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Decibel reading (dB)
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={value.decibelReading ?? ""}
              onChange={handleNumberChange}
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
            placeholder="Add any additional remarks about noise level..."
            className={`${inputClass} h-20 resize-none`}
          />
        </div>
      </div>
    </FormCard>
  );
};

export default NoiseLevelCard;
