import { useMemo } from "react";
import CustomLineChart from "../Charts/CustomLineChart";
import { parse, compareAsc } from "date-fns";

interface DataItem {
  month: string;
  count: number;
}

const UsersByMonthChart = ({ data = [] }: { data?: DataItem[] }) => {
  // Sort and format data chronologically using useMemo
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sortedData = [...data].sort((a, b) => {
      const dateA = parse(a.month, "MMM yyyy", new Date());
      const dateB = parse(b.month, "MMM yyyy", new Date());
      return compareAsc(dateA, dateB);
    });

    return sortedData.map((item) => ({
      month: item.month,
      value: item.count,
    }));
  }, [data]);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 col-span-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">
          Users by Month
        </h3>
      </div>

      {chartData.length > 0 ? (
        <CustomLineChart
          data={chartData}
          strokeColor="#10b981"
          labelKey="Users"
        />
      ) : (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          No monthly user growth data available.
        </div>
      )}
    </div>
  );
};

export default UsersByMonthChart;
