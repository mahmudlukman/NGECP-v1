import CustomLineChart from "../Charts/CustomLineChart";
import { parse, compareAsc } from "date-fns";

interface DataItem {
  month: string;
  count: number;
}

const GeneratorsByMonthChart = ({ data = [] }: { data?: DataItem[] }) => {
  // Sort data chronologically (oldest to newest)
  const sortedData = [...data].sort((a, b) => {
    const dateA = parse(a.month, "MMM yyyy", new Date());
    const dateB = parse(b.month, "MMM yyyy", new Date());
    return compareAsc(dateA, dateB);
  });

  const chartData = sortedData.map((item) => ({
    month: item.month,
    value: item.count,
  }));

  return (
    <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 col-span-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">
          Generators by Month
        </h3>
      </div>

      {chartData.length > 0 ? (
        <CustomLineChart
          data={chartData}
          strokeColor="#10b981"
          labelKey="Generators"
        />
      ) : (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          No monthly generator data available.
        </div>
      )}
    </div>
  );
};

export default GeneratorsByMonthChart;
