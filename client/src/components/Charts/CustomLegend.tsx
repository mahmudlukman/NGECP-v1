import React from "react";
import type { LegendPayload } from "recharts";

interface CustomLegendProps {
  payload?: readonly LegendPayload[];
}

const CustomLegend: React.FC<CustomLegendProps> = ({ payload = [] }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-4 font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
      {payload.map((entry, index) => (
        <div
          key={`${entry.value ?? "item"}-${index}`}
          className="flex items-center gap-2"
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{
              backgroundColor: entry.color ?? "#0B1F1A",
            }}
          />

          <span className="text-sm font-medium text-[#0B1F1A]/70">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
