import React from "react";
import type { LegendPayload } from "recharts";

interface CustomLegendProps {
  payload?: readonly LegendPayload[];
}

const CustomLegend: React.FC<CustomLegendProps> = ({ payload = [] }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-4">
      {payload.map((entry, index) => (
        <div
          key={`${entry.value ?? "item"}-${index}`}
          className="flex items-center gap-2"
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{
              backgroundColor: entry.color ?? "#64748B",
            }}
          />

          <span className="text-sm font-medium text-slate-600">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
