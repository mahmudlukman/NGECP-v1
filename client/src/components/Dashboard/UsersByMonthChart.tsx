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
    <div className="col-span-1 rounded-2xl border border-[#0B1F1A]/10 bg-white p-5 font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-[Newsreader,Georgia,serif] text-base font-normal text-[#0B1F1A]">
          Users by Month
        </h3>
      </div>

      {chartData.length > 0 ? (
        <CustomLineChart
          data={chartData}
          strokeColor="#16785A"
          labelKey="Users"
        />
      ) : (
        <div className="flex h-64 items-center justify-center text-xs text-[#0B1F1A]/40">
          No monthly user growth data available.
        </div>
      )}
    </div>
  );
};

export default UsersByMonthChart;
