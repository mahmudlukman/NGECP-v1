import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import CustomLegend from "./CustomLegend";
import CustomTooltip from "./CustomTooltip";

interface DataItem {
  name: string;
  amount: number;
  [key: string]: string | number;
}

interface CustomPieChartProps {
  data: DataItem[];
  label?: string;
  totalInspections?: string | number;
  showTextAnchor?: boolean;
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#059669", // Emerald-600
  "#10B981", // Emerald-500
  "#34D399", // Emerald-400
  "#A7F3D0", // Emerald-200
  "#64748B", // Slate-500
];

const CustomPieChart: React.FC<CustomPieChartProps> = ({
  data,
  label = "Total",
  totalInspections,
  showTextAnchor = true,
  colors = DEFAULT_COLORS,
}) => {
  const formattedTotal =
    totalInspections !== undefined
      ? typeof totalInspections === "number"
        ? totalInspections.toLocaleString()
        : totalInspections
      : "";

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <ResponsiveContainer width="100%" height={380}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={120}
            innerRadius={90}
            paddingAngle={3}
            cornerRadius={2}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />

          <Legend
            content={(props) => <CustomLegend payload={props.payload ?? []} />}
          />

          {showTextAnchor && (
            <g>
              <text
                x="50%"
                y="45%"
                dy={-10}
                textAnchor="middle"
                className="fill-slate-500 text-xs font-semibold uppercase tracking-wider"
              >
                {label}
              </text>

              <text
                x="50%"
                y="45%"
                dy={18}
                textAnchor="middle"
                className="fill-slate-900 text-2xl font-extrabold tracking-tight"
              >
                {formattedTotal}
              </text>
            </g>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
