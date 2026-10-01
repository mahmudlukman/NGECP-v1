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
  // Ink/mint brand palette, with amber and rose kept for
  // "in progress" and "non-compliant" states respectively —
  // those two carry semantic meaning that shouldn't be brand-colored.
  const COLORS = ["#16785A", "#9CA3AF", "#F59E0B", "#7FD1AE", "#E11D48"];

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
    <div className="rounded-2xl border border-[#0B1F1A]/10 bg-white p-5 font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-xs">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-[Newsreader,Georgia,serif] text-base font-normal text-[#0B1F1A]">
          Generators Overview
        </h3>
        <span className="text-xs font-medium text-[#0B1F1A]/55">
          Total:{" "}
          <strong className="font-semibold text-[#0B1F1A]">
            {totalCalculated}
          </strong>
        </span>
      </div>

      <CustomPieChart
        data={generatorsData}
        label="Total Generators"
        colors={COLORS}
        totalInspections={totalCalculated}
        showTextAnchor
      />
    </div>
  );
};

export default GeneratorsOverview;
