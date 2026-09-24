import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

interface ChartDataItem {
  month: string;
  value: number;
  label?: string;
}

interface CustomLineChartProps {
  data: ChartDataItem[];
  strokeColor?: string;
  labelKey?: string;
  valuePrefix?: string;
}

const CustomLineChart = ({
  data,
  strokeColor = "#059669", // Emerald-600 default
  labelKey = "Users",
  valuePrefix = "",
}: CustomLineChartProps) => {
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: ChartDataItem }>;
  }) => {
    if (active && payload && payload.length) {
      const { month, value, label } = payload[0].payload;
      return (
        <div className="bg-white px-3 py-2 rounded-xl shadow-xs border border-slate-200 text-xs">
          <p className="font-semibold text-slate-500 mb-0.5">
            {label || month}
          </p>
          <p className="text-slate-700 font-medium flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: strokeColor }}
            />
            {labelKey}:{" "}
            <span className="font-bold text-slate-900">
              {valuePrefix}
              {value.toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Generate unique gradient ID based on stroke color
  const gradientId = `gradient-${strokeColor.replace("#", "")}`;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.01} />
            </linearGradient>
          </defs>
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
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748B" }}
            axisLine={false}
            tickLine={false}
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={{
              r: 3.5,
              fill: strokeColor,
              strokeWidth: 2,
              stroke: "#ffffff",
            }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#ffffff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
