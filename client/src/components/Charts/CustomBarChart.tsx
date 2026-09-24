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
  // Alternate between deep emerald and soft emerald tones
  const getBarColor = (index: number): string => {
    return index % 2 === 0 ? "#059669" : "#A7F3D0";
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white px-3 py-2 rounded-xl shadow-xs border border-slate-200 text-xs">
          <p className="font-semibold text-slate-500 mb-0.5">{item.month}</p>
          <p className="text-slate-700 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            Inspections:{" "}
            <span className="font-bold text-slate-900">
              {item.amount.toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#F1F5F9"
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#64748B" }}
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748B" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tickCount={6}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />

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
