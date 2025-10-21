import CustomPieChart from "../Charts/CustomPieChart";

interface GeneratorOverviewProps {
  active: number;
  inactive: number;
  underInspection: number;
  compliant: number;
  nonCompliant: number;
  totalGenerators: number;
}

const GeneratorsOverview = ({
  active,
  inactive,
  underInspection,
  compliant,
  nonCompliant,
}: GeneratorOverviewProps) => {
  const COLORS = ["#875CF5", "#FA2C37", "#06B6D4", "#4fbf8b", "#c40477ff"];

  const generatorsData = [
    { name: "Active", amount: active },
    { name: "Inactive", amount: inactive },
    { name: "Under Inspection", amount: underInspection },
    { name: "Compliant", amount: compliant },
    { name: "Non-Compliant", amount: nonCompliant },
  ];

  const totalGenerators =
    active + inactive + underInspection + compliant + nonCompliant;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Generators Overview</h5>
      </div>

      <CustomPieChart
        data={generatorsData}
        label="Total Generators"
        colors={COLORS}
        totalInspections={totalGenerators}
        showTextAnchor
      />
    </div>
  );
};

export default GeneratorsOverview;
