import { Fuel } from "lucide-react";
import FormCard from "./FormCard";
import type { FuelEfficiencyData } from "../../@types";
import PassFailToggle from "../PassFailToggle";

interface FuelEfficiencyCardProps {
  value: FuelEfficiencyData;
  onChange: (value: FuelEfficiencyData) => void;
}

const inputClass =
  "w-full border border-[#0B1F1A]/15 text-[#0B1F1A] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#16785A]/20 focus:border-[#16785A]";

const labelClass = "block text-sm font-medium text-[#0B1F1A]/70 mb-2";

const FuelEfficiencyCard = ({ value, onChange }: FuelEfficiencyCardProps) => {
  const update = (patch: Partial<FuelEfficiencyData>) =>
    onChange({ ...value, ...patch });

  return (
    <FormCard
      icon={Fuel}
      title="Fuel efficiency"
      description="Rated efficiency band for this unit"
      action={
        <PassFailToggle
          value={value.passed}
          onChange={(passed) => update({ passed })}
        />
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Rating</label>
            <select
              value={value.rating || ""}
              onChange={(e) => update({ rating: e.target.value })}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Select rating</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            value={value.notes || ""}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Add any additional remarks about fuel efficiency..."
            className={`${inputClass} h-20 resize-none`}
          />
        </div>
      </div>
    </FormCard>
  );
};

export default FuelEfficiencyCard;
