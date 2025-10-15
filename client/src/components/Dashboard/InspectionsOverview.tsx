import CustomPieChart from "../Charts/CustomPieChart";

interface InspectionOverviewProps {
  totalInspections: number;
  Pending: number;
  Scheduled: number;
  Completed: number;
  Cancelled: number;
}

const InspectionOverview = ({
  Pending,
  Scheduled,
  Completed,
  Cancelled,
  totalInspections,
}: InspectionOverviewProps) => {
  const COLORS = ["#875CF5", "#FA2C37", "#06B6D4", "#4fbf8b"];

  const inspectionData = [
    { name: "Pending", amount: Pending },
    { name: "Canceled", amount: Cancelled },
    { name: "Scheduled", amount: Scheduled },
    { name: "Completed", amount: Completed },
  ];

  // const totalInspections = Pending + Scheduled + Completed + Cancelled;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Inspection Overview</h5>
      </div>

      <CustomPieChart
        data={inspectionData}
        label="Total Inspection"
        colors={COLORS}
        totalInspections={totalInspections}
        showTextAnchor
      />
    </div>
  );
};

export default InspectionOverview;
