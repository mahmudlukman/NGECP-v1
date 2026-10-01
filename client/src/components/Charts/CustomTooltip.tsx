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
    const dotColor = item.color || item.payload?.color || "#16785A";

    return (
      <div className="rounded-xl border border-[#0B1F1A]/10 bg-white px-3 py-2 text-xs shadow-[0_20px_40px_-24px_rgba(11,31,26,0.35)]">
        <p className="mb-1 flex items-center gap-1.5 font-semibold text-[#0B1F1A]/50">
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
          {item.name}
        </p>
        <p className="pl-3.5 font-medium text-[#0B1F1A]/80">
          Amount:{" "}
          <span className="font-bold text-[#0B1F1A]">
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
