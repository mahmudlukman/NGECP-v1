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
    <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 col-span-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">
          Inspections by Month
        </h3>
      </div>

      {chartData.length > 0 ? (
        <CustomBarChart data={chartData} />
      ) : (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          No monthly inspection data available.
        </div>
      )}
    </div>
  );
};

export default InspectionsByMonthChart;
