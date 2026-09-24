import type { TooltipProps } from "recharts";

interface CustomPayloadItem {
  name: string;
  value: number;
  color?: string;
  payload?: {
    color?: string;
    [key: string]: unknown;
  };
}

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<number, string> & { payload?: CustomPayloadItem[] }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const dotColor = item.color || item.payload?.color || "#059669";

    return (
      <div className="bg-white px-3 py-2 rounded-xl shadow-xs border border-slate-200 text-xs">
        <p className="font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full inline-block shrink-0"
            style={{ backgroundColor: dotColor }}
          />
          {item.name}
        </p>
        <p className="text-slate-700 font-medium pl-3.5">
          Amount:{" "}
          <span className="font-bold text-slate-900">
            {typeof item.value === "number"
              ? item.value.toLocaleString()
              : item.value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;