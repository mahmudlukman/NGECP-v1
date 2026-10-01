import { useMemo } from "react";
import { prepareInspectionsByMonthChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

interface Props {
  data?: {
    month: string;
    count: number;
  }[];
}

const InspectionsByMonthChart = ({ data = [] }: Props) => {
  // Compute chart data directly during render instead of state + useEffect
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return prepareInspectionsByMonthChartData(data);
  }, [data]);

  return (
    <div className="col-span-1 rounded-2xl border border-[#0B1F1A]/10 bg-white p-5 font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-[Newsreader,Georgia,serif] text-base font-normal text-[#0B1F1A]">
          Inspections by Month
        </h3>
      </div>

      {chartData.length > 0 ? (
        <CustomBarChart data={chartData} />
      ) : (
        <div className="flex h-64 items-center justify-center text-xs text-[#0B1F1A]/40">
          No monthly inspection data available.
        </div>
      )}
    </div>
  );
};

export default InspectionsByMonthChart;
