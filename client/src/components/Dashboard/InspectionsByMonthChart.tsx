import { useEffect, useState } from "react";
import { prepareInspectionsByMonthChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

interface Props {
  data: {
    month: string;
    count: number;
  }[];
}

const InspectionsByMonthChart = ({ data }: Props) => {
  const [chartData, setChartData] = useState<
    { month: string; amount: number }[]
  >([]);

  useEffect(() => {
    const result = prepareInspectionsByMonthChartData(data);
    setChartData(result);
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Inspection by Month</h5>
      </div>

      <CustomBarChart data={chartData} />
    </div>
  );
};

export default InspectionsByMonthChart;