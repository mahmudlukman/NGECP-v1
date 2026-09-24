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
  // Semantic Status Color Palette:
  // Pending (Amber), Canceled (Rose), Scheduled (Sky), Completed (Emerald)
  const COLORS = ["#f59e0b", "#e11d48", "#0284c7", "#10b981"];

  const inspectionData = [
    { name: "Pending", amount: Pending },
    { name: "Canceled", amount: Cancelled },
    { name: "Scheduled", amount: Scheduled },
    { name: "Completed", amount: Completed },
  ];

  const totalCalculated =
    totalInspections ?? Pending + Scheduled + Completed + Cancelled;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">
          Inspection Overview
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          Total: <strong className="text-slate-800">{totalCalculated}</strong>
        </span>
      </div>

      <div className="flex flex-col items-center">
        <CustomPieChart
          data={inspectionData}
          label="Total Inspections"
          colors={COLORS}
          totalInspections={totalCalculated}
          showTextAnchor
        />

        {/* Legend Breakdown */}
        <div className="w-full grid grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-slate-100">
          {inspectionData.map((item, idx) => (
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

export default InspectionOverview;
