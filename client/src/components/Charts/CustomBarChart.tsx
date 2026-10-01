import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartDataItem {
  month: string;
  amount: number;
}

interface CustomBarChartProps {
  data: ChartDataItem[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
    value: number;
  }>;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({ data }) => {
  // Alternate between deep ink and mint tones
  const getBarColor = (index: number): string => {
    return index % 2 === 0 ? "#0B1F1A" : "#16785A";
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl border border-[#0B1F1A]/10 bg-white px-3 py-2 text-xs shadow-[0_20px_40px_-24px_rgba(11,31,26,0.35)]">
          <p className="mb-0.5 font-semibold text-[#0B1F1A]/50">{item.month}</p>
          <p className="flex items-center gap-1.5 font-medium text-[#0B1F1A]/80">
            <span className="inline-block h-2 w-2 rounded-full bg-[#16785A]" />
            Inspections:{" "}
            <span className="font-bold text-[#0B1F1A]">
              {item.amount.toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-xs">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(11,31,26,0.08)"
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "rgba(11,31,26,0.55)" }}
            axisLine={{ stroke: "rgba(11,31,26,0.12)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "rgba(11,31,26,0.55)" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tickCount={6}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(11,31,26,0.04)" }}
          />

          <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
            {data.map((_entry: ChartDataItem, index: number) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
