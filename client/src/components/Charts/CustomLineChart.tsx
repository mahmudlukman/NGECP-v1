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
  strokeColor = "#16785A", // Brand mint default
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
        <div className="rounded-xl border border-[#0B1F1A]/10 bg-white px-3 py-2 text-xs shadow-[0_20px_40px_-24px_rgba(11,31,26,0.35)]">
          <p className="mb-0.5 font-semibold text-[#0B1F1A]/50">
            {label || month}
          </p>
          <p className="flex items-center gap-1.5 font-medium text-[#0B1F1A]/80">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: strokeColor }}
            />
            {labelKey}:{" "}
            <span className="font-bold text-[#0B1F1A]">
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
    <div className="rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-xs">
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
            stroke="rgba(11,31,26,0.08)"
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "rgba(11,31,26,0.55)" }}
            axisLine={{ stroke: "rgba(11,31,26,0.12)" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "rgba(11,31,26,0.55)" }}
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
