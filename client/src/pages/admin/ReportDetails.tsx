import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetReportByIdQuery,
  useApproveInspectionReportMutation,
} from "../../redux/features/report/reportApi";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Loading from "../../components/Loading";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Building2,
  FileText,
  Award,
  Download,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";

// Shared pass/fail badge classes, matching PassFailToggle and InspectionOverview.
const passFailBadge = (passed?: boolean) =>
  passed ? "bg-[#16785A]/10 text-[#16785A]" : "bg-rose-100 text-rose-700";

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetReportByIdQuery({ id });
  const [approveReport, { isLoading: isApproving }] =
    useApproveInspectionReportMutation();

  const handleApprove = async () => {
    if (!id) return;
    try {
      await approveReport(id).unwrap();
      toast.success("Report approved successfully");
      refetch();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to approve report";
      toast.error(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loading fullScreen={false} />
      </DashboardLayout>
    );
  }

  if (isError || !data?.report) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <p className="text-rose-600">Failed to load report details.</p>
        </div>
      </DashboardLayout>
    );
  }

  const report = data.report;

  return (
    <DashboardLayout>
      <div className="my-5 w-full rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-[0_20px_40px_-30px_rgba(11,31,26,0.25)]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/reports")}
              className="cursor-pointer rounded-full p-2 text-[#0B1F1A]/55 transition hover:bg-[#0B1F1A]/[0.06]"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-[Newsreader,Georgia,serif] text-2xl font-normal text-[#0B1F1A]/70">
              Inspection{" "}
              <span className="font-medium text-[#0B1F1A]">Report Details</span>
            </h1>
          </div>
          <button
            onClick={() => window.print()}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#0B1F1A] px-4 py-2 text-sm text-[#F3F1EA] transition hover:bg-[#12332b]"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>

        {/* Approval Status Banner */}
        {report.isApproved ? (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#16785A]/25 bg-[#16785A]/[0.06] p-4">
            <CheckCircle
              size={24}
              className="mt-0.5 flex-shrink-0 text-[#16785A]"
            />
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-[#0B1F1A]">
                Report Approved
              </h3>
              <p className="text-sm text-[#0B1F1A]/65">
                Approved by {report.approvedBy?.name || "N/A"} on{" "}
                {report.approvalDate
                  ? format(new Date(report.approvalDate), "dd MMMM yyyy, HH:mm")
                  : "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={24}
                className="mt-0.5 flex-shrink-0 text-amber-600"
              />
              <div>
                <h3 className="mb-1 font-semibold text-amber-900">
                  Pending Approval
                </h3>
                <p className="text-sm text-amber-700">
                  This report is awaiting approval from an administrator.
                </p>
              </div>
            </div>
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50"
            >
              <ShieldCheck size={16} />
              {isApproving ? "Approving..." : "Approve Report"}
            </button>
          </div>
        )}

        {/* Overall Compliance Score */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-[#0B1F1A]/10 bg-[#F7F6F1] p-4">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-full p-3 ${
                  report.overallCompliance
                    ? "bg-[#16785A]/10 text-[#16785A]"
                    : "bg-rose-100 text-rose-600"
                }`}
              >
                {report.overallCompliance ? (
                  <CheckCircle size={24} />
                ) : (
                  <XCircle size={24} />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-[#0B1F1A]/55">
                  Overall Compliance
                </p>
                <p
                  className={`text-lg font-bold ${
                    report.overallCompliance
                      ? "text-[#16785A]"
                      : "text-rose-600"
                  }`}
                >
                  {report.overallCompliance ? "Compliant" : "Non-Compliant"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#0B1F1A]/10 bg-[#F7F6F1] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#16785A]/10 p-3 text-[#16785A]">
                <Award size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0B1F1A]/55">
                  Compliance Score
                </p>
                <p className="font-[Newsreader,Georgia,serif] text-lg font-normal text-[#0B1F1A]">
                  {report.complianceScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#0B1F1A]/10 bg-[#F7F6F1] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#0B1F1A]/[0.06] p-3 text-[#0B1F1A]/70">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0B1F1A]/55">
                  Report Date
                </p>
                <p className="font-[Newsreader,Georgia,serif] text-lg font-normal text-[#0B1F1A]">
                  {format(
                    new Date(report.reportDate || report.createdAt),
                    "dd MMM yyyy",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Generator & Inspection Information */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Generator Info */}
          <div className="rounded-lg border border-[#0B1F1A]/10 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-[#0B1F1A]/60" />
              <h3 className="text-lg font-semibold text-[#0B1F1A]">
                Generator Information
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#0B1F1A]/55">Generator ID:</span>
                <span className="font-medium text-[#0B1F1A]">
                  {report.generator?.generatorId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0B1F1A]/55">Brand:</span>
                <span className="font-medium text-[#0B1F1A]">
                  {report.generator?.brand || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0B1F1A]/55">Model:</span>
                <span className="font-medium text-[#0B1F1A]">
                  {report.generator?.model || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0B1F1A]/55">Serial Number:</span>
                <span className="font-medium text-[#0B1F1A]">
                  {report.generator?.serialNumber || "N/A"}
                </span>
              </div>
              {report.generator?.location && (
                <div className="flex justify-between">
                  <span className="text-[#0B1F1A]/55">Location:</span>
                  <span className="font-medium text-[#0B1F1A]">
                    {report.generator.location.address},{" "}
                    {report.generator.location.lga}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Inspector & Owner Info */}
          <div className="rounded-lg border border-[#0B1F1A]/10 p-5">
            <div className="mb-4 flex items-center gap-2">
              <User size={20} className="text-[#0B1F1A]/60" />
              <h3 className="text-lg font-semibold text-[#0B1F1A]">
                Inspection Details
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="mb-1 block text-[#0B1F1A]/55">Inspector:</span>
                <span className="font-medium text-[#0B1F1A]">
                  {report.inspector?.name || "N/A"}
                </span>
                <br />
                <span className="text-xs text-[#0B1F1A]/45">
                  {report.inspector?.email || "N/A"}
                </span>
              </div>
              <div>
                <span className="mb-1 block text-[#0B1F1A]/55">Owner:</span>
                <span className="font-medium text-[#0B1F1A]">
                  {report.inspection?.owner?.companyName ||
                    report.inspection?.owner?.name ||
                    "N/A"}
                </span>
                <br />
                <span className="text-xs text-[#0B1F1A]/45">
                  {report.inspection?.owner?.email || "N/A"}
                </span>
              </div>
              {report.nextInspectionDate && (
                <div className="flex justify-between border-t border-[#0B1F1A]/10 pt-2">
                  <span className="text-[#0B1F1A]/55">Next Inspection:</span>
                  <span className="font-medium text-[#0B1F1A]">
                    {format(new Date(report.nextInspectionDate), "dd MMM yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="mb-6 rounded-lg border border-[#0B1F1A]/10 p-5">
          <div className="mb-4 flex items-center gap-2">
            <FileText size={20} className="text-[#0B1F1A]/60" />
            <h3 className="text-lg font-semibold text-[#0B1F1A]">
              Test Results
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Emissions Test */}
            <div className="rounded-lg bg-[#F7F6F1] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold text-[#0B1F1A]/80">
                  Emissions Test
                </h4>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${passFailBadge(
                    report.emissionsTest?.passed,
                  )}`}
                >
                  {report.emissionsTest?.passed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {report.emissionsTest?.co2Level !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-[#0B1F1A]/55">CO2 Level:</span>
                    <span className="font-medium text-[#0B1F1A]">
                      {report.emissionsTest.co2Level} ppm
                    </span>
                  </div>
                )}
                {report.emissionsTest?.noxLevel !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-[#0B1F1A]/55">NOx Level:</span>
                    <span className="font-medium text-[#0B1F1A]">
                      {report.emissionsTest.noxLevel} ppm
                    </span>
                  </div>
                )}
                {report.emissionsTest?.particulateLevel !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-[#0B1F1A]/55">
                      Particulate Level:
                    </span>
                    <span className="font-medium text-[#0B1F1A]">
                      {report.emissionsTest.particulateLevel} µg/m³
                    </span>
                  </div>
                )}
                {report.emissionsTest?.notes && (
                  <div className="border-t border-[#0B1F1A]/10 pt-2">
                    <span className="mb-1 block text-[#0B1F1A]/55">Notes:</span>
                    <p className="text-[#0B1F1A]/75">
                      {report.emissionsTest.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Noise Level */}
            <div className="rounded-lg bg-[#F7F6F1] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold text-[#0B1F1A]/80">
                  Noise Level Test
                </h4>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${passFailBadge(
                    report.noiseLevel?.passed,
                  )}`}
                >
                  {report.noiseLevel?.passed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {report.noiseLevel?.decibelReading !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-[#0B1F1A]/55">Decibel Reading:</span>
                    <span className="font-medium text-[#0B1F1A]">
                      {report.noiseLevel.decibelReading} dB
                    </span>
                  </div>
                )}
                {report.noiseLevel?.notes && (
                  <div className="border-t border-[#0B1F1A]/10 pt-2">
                    <span className="mb-1 block text-[#0B1F1A]/55">Notes:</span>
                    <p className="text-[#0B1F1A]/75">
                      {report.noiseLevel.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fuel Efficiency */}
            <div className="rounded-lg bg-[#F7F6F1] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold text-[#0B1F1A]/80">
                  Fuel Efficiency
                </h4>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${passFailBadge(
                    report.fuelEfficiency?.passed,
                  )}`}
                >
                  {report.fuelEfficiency?.passed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {report.fuelEfficiency?.rating && (
                  <div className="flex justify-between">
                    <span className="text-[#0B1F1A]/55">Rating:</span>
                    <span className="font-medium text-[#0B1F1A]">
                      {report.fuelEfficiency.rating}
                    </span>
                  </div>
                )}
                {report.fuelEfficiency?.notes && (
                  <div className="border-t border-[#0B1F1A]/10 pt-2">
                    <span className="mb-1 block text-[#0B1F1A]/55">Notes:</span>
                    <p className="text-[#0B1F1A]/75">
                      {report.fuelEfficiency.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Maintenance Status */}
            <div className="rounded-lg bg-[#F7F6F1] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold text-[#0B1F1A]/80">
                  Maintenance Status
                </h4>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${passFailBadge(
                    report.maintenanceStatus?.passed,
                  )}`}
                >
                  {report.maintenanceStatus?.passed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {report.maintenanceStatus?.issues &&
                  report.maintenanceStatus.issues.length > 0 && (
                    <div>
                      <span className="mb-2 block text-[#0B1F1A]/55">
                        Issues:
                      </span>
                      <ul className="list-inside list-disc space-y-1 text-[#0B1F1A]/75">
                        {report.maintenanceStatus.issues.map(
                          (issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                {report.maintenanceStatus?.notes && (
                  <div className="border-t border-[#0B1F1A]/10 pt-2">
                    <span className="mb-1 block text-[#0B1F1A]/55">Notes:</span>
                    <p className="text-[#0B1F1A]/75">
                      {report.maintenanceStatus.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Safety Compliance */}
            <div className="rounded-lg bg-[#F7F6F1] p-4 md:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold text-[#0B1F1A]/80">
                  Safety Compliance
                </h4>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${passFailBadge(
                    report.safetyCompliance?.passed,
                  )}`}
                >
                  {report.safetyCompliance?.passed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {report.safetyCompliance?.issues &&
                  report.safetyCompliance.issues.length > 0 && (
                    <div>
                      <span className="mb-2 block text-[#0B1F1A]/55">
                        Issues:
                      </span>
                      <ul className="list-inside list-disc space-y-1 text-[#0B1F1A]/75">
                        {report.safetyCompliance.issues.map(
                          (issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                {report.safetyCompliance?.notes && (
                  <div className="border-t border-[#0B1F1A]/10 pt-2">
                    <span className="mb-1 block text-[#0B1F1A]/55">Notes:</span>
                    <p className="text-[#0B1F1A]/75">
                      {report.safetyCompliance.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations & Required Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Recommendations */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="rounded-lg border border-[#0B1F1A]/10 p-5">
              <h3 className="mb-4 text-lg font-semibold text-[#0B1F1A]">
                Recommendations
              </h3>
              <ul className="space-y-2">
                {report.recommendations.map((rec: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-[#0B1F1A]/75"
                  >
                    <span className="mt-0.5 font-bold text-[#16785A]">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Actions */}
          {report.requiredActions && report.requiredActions.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-amber-900">
                Required Actions
              </h3>
              <ul className="space-y-2">
                {report.requiredActions.map((action: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-amber-800"
                  >
                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportDetails;
