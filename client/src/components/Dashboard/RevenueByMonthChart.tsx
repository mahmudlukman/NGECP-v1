import { useEffect, useState } from "react";
import { prepareRevenueByMonthChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

interface Props {
  data: {
    month: string;
    revenue: number;
  }[];
}

const RevenueByMonthChart = ({ data }: Props) => {
  const [chartData, setChartData] = useState<
    { month: string; amount: number }[]
  >([]);

  useEffect(() => {
    // Log data for debugging
    console.log("RevenueByMonthChart data:", data);
    const result = prepareRevenueByMonthChartData(data);
    setChartData(result);
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Revenue by Month</h5>
      </div>

      <CustomBarChart data={chartData} />
    </div>
  );
};

export default RevenueByMonthChart;