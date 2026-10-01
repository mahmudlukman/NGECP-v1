import CustomPieChart from "../Charts/CustomPieChart";

interface InspectionOverviewProps {
  totalInspections?: number;
  Pending?: number;
  Scheduled?: number;
  Completed?: number;
  Cancelled?: number;
}

const InspectionOverview = ({
  Pending = 0,
  Scheduled = 0,
  Completed = 0,
  Cancelled = 0,
  totalInspections,
}: InspectionOverviewProps) => {
  // Semantic status palette: amber = pending, rose = cancelled,
  // neutral grey = scheduled (informational), mint = completed (brand accent, "done well").
  const COLORS = ["#F59E0B", "#E11D48", "#9CA3AF", "#16785A"];

  const inspectionData = [
    { name: "Pending", amount: Pending },
    { name: "Canceled", amount: Cancelled },
    { name: "Scheduled", amount: Scheduled },
    { name: "Completed", amount: Completed },
  ];

  const totalCalculated =
    totalInspections ?? Pending + Scheduled + Completed + Cancelled;

  return (
    <div className="rounded-2xl border border-[#0B1F1A]/10 bg-white p-5 font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-xs">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-[Newsreader,Georgia,serif] text-base font-normal text-[#0B1F1A]">
          Inspection Overview
        </h3>
        <span className="text-xs font-medium text-[#0B1F1A]/55">
          Total:{" "}
          <strong className="font-semibold text-[#0B1F1A]">
            {totalCalculated}
          </strong>
        </span>
      </div>

      <CustomPieChart
        data={inspectionData}
        label="Total Inspections"
        colors={COLORS}
        totalInspections={totalCalculated}
        showTextAnchor
      />
    </div>
  );
};

export default InspectionOverview;
