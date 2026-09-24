import CustomPieChart from "../Charts/CustomPieChart";

interface GeneratorOverviewProps {
  active?: number;
  inactive?: number;
  underInspection?: number;
  compliant?: number;
  nonCompliant?: number;
  totalGenerators?: number;
}

const GeneratorsOverview = ({
  active = 0,
  inactive = 0,
  underInspection = 0,
  compliant = 0,
  nonCompliant = 0,
}: GeneratorOverviewProps) => {
  // Slate/Emerald cohesive palette mapping:
  // Emerald (Active/Compliant), Slate (Inactive), Amber (Under Inspection), Rose (Non-Compliant), Indigo (Secondary)
  const COLORS = ["#10b981", "#64748b", "#f59e0b", "#059669", "#e11d48"];

  const generatorsData = [
    { name: "Active", amount: active },
    { name: "Inactive", amount: inactive },
    { name: "Under Inspection", amount: underInspection },
    { name: "Compliant", amount: compliant },
    { name: "Non-Compliant", amount: nonCompliant },
  ];

  const totalCalculated =
    active + inactive + underInspection + compliant + nonCompliant;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">
          Generators Overview
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          Total: <strong className="text-slate-800">{totalCalculated}</strong>
        </span>
      </div>

      <div className="flex flex-col items-center">
        <CustomPieChart
          data={generatorsData}
          label="Total Generators"
          colors={COLORS}
          totalInspections={totalCalculated}
          showTextAnchor
        />

        {/* Legend Breakdown */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-100">
          {generatorsData.map((item, idx) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[idx] }}
              />
              <div className="text-xs truncate">
                <span className="text-slate-500 block truncate">
                  {item.name}
                </span>
                <span className="font-semibold text-slate-800">
                  {item.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneratorsOverview;
