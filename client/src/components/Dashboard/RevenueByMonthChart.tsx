import { useMemo } from "react";
import { prepareRevenueByMonthChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

interface Props {
  data?: {
    month: string;
    revenue: number;
  }[];
}

const RevenueByMonthChart = ({ data = [] }: Props) => {
  // Compute chart data directly during render using useMemo
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return prepareRevenueByMonthChartData(data);
  }, [data]);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 col-span-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">
          Revenue by Month
        </h3>
      </div>

      {chartData.length > 0 ? (
        <CustomBarChart data={chartData} />
      ) : (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          No monthly revenue data available.
        </div>
      )}
    </div>
  );
};

export default RevenueByMonthChart;
