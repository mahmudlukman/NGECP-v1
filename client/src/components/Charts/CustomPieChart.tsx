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
  "#0B1F1A", // Ink
  "#16785A", // Mint (brand accent)
  "#7FD1AE", // Light mint
  "#0B1F1A80", // Ink, 50% (rendered as translucent ink)
  "#9CA3AF", // Neutral grey, for an "other" catch-all slice
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
    <div className="h-[320px] w-full font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={105}
            innerRadius={75}
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
                className="fill-[#0B1F1A]/50 text-xs font-semibold uppercase tracking-wider"
              >
                {label}
              </text>

              <text
                x="50%"
                y="45%"
                dy={20}
                textAnchor="middle"
                className="fill-[#0B1F1A] text-2xl font-normal tracking-tight"
                style={{ fontFamily: "Newsreader, Georgia, serif" }}
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