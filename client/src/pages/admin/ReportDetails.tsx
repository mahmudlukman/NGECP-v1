import { useNavigate, useParams } from "react-router-dom";
import { useGetReportByIdQuery } from "../../redux/features/report/reportApi";
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
} from "lucide-react";
import { format } from "date-fns";

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetReportByIdQuery({ id });

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="Reports">
        <Loading />
      </DashboardLayout>
    );
  }

  if (isError || !data?.report) {
    return (
      <DashboardLayout activeMenu="Reports">
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-red-500">Failed to load report details.</p>
        </div>
      </DashboardLayout>
    );
  }

  const report = data.report;

  return (
    <DashboardLayout activeMenu="Reports">
      <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/reports")}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl text-slate-600 font-semibold">
              Inspection{" "}
              <span className="text-slate-800 font-bold">Report Details</span>
            </h1>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>

        {/* Approval Status Banner */}
        {report.isApproved ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <CheckCircle
              size={24}
              className="text-green-600 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-1">
                Report Approved
              </h3>
              <p className="text-sm text-green-700">
                Approved by {report.approvedBy?.name || "N/A"} on{" "}
                {report.approvalDate
                  ? format(new Date(report.approvalDate), "dd MMMM yyyy, HH:mm")
                  : "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle
              size={24}
              className="text-orange-600 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">
                Pending Approval
              </h3>
              <p className="text-sm text-orange-700">
                This report is awaiting approval from an administrator.
              </p>
            </div>
          </div>
        )}

        {/* Overall Compliance Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full ${
                  report.overallCompliance
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {report.overallCompliance ? (
                  <CheckCircle size={24} />
                ) : (
                  <XCircle size={24} />
                )}
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">
                  Overall Compliance
                </p>
                <p
                  className={`text-lg font-bold ${
                    report.overallCompliance ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {report.overallCompliance ? "Compliant" : "Non-Compliant"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Award size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">
                  Compliance Score
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {report.complianceScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">
                  Report Date
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {format(
                    new Date(report.reportDate || report.createdAt),
                    "dd MMM yyyy"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Generator & Inspection Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Generator Info */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={20} className="text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Generator Information
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Generator ID:</span>
                <span className="font-medium text-slate-800">
                  {report.generator?.generatorId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Brand:</span>
                <span className="font-medium text-slate-800">
                  {report.generator?.brand || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Model:</span>
                <span className="font-medium text-slate-800">
                  {report.generator?.model || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Serial Number:</span>
                <span className="font-medium text-slate-800">
                  {report.generator?.serialNumber || "N/A"}
                </span>
              </div>
              {report.generator?.location && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Location:</span>
                  <span className="font-medium text-slate-800">
                    {report.generator.location.address},{" "}
                    {report.generator.location.lga}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Inspector & Owner Info */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Inspection Details
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-600 block mb-1">Inspector:</span>
                <span className="font-medium text-slate-800">
                  {report.inspector?.name || "N/A"}
                </span>
                <br />
                <span className="text-slate-500 text-xs">
                  {report.inspector?.email || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-slate-600 block mb-1">Owner:</span>
                <span className="font-medium text-slate-800">
                  {report.inspection?.owner?.companyName ||
                    report.inspection?.owner?.name ||
                    "N/A"}
                </span>
                <br />
                <span className="text-slate-500 text-xs">
                  {report.inspection?.owner?.email || "N/A"}
                </span>
              </div>
              {report.nextInspectionDate && (
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-slate-600">Next Inspection:</span>
                  <span className="font-medium text-slate-800">
                    {format(new Date(report.nextInspectionDate), "dd MMM yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Test Results
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emissions Test */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-700">Emissions Test</h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.emissionsTest?.passed
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {report.emissionsTest?.passed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {report.emissionsTest?.co2Level !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">CO2 Level:</span>
                    <span className="font-medium text-slate-800">
                      {report.emissionsTest.co2Level} ppm
                    </span>
                  </div>
                )}
                {report.emissionsTest?.noxLevel !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">NOx Level:</span>
                    <span className="font-medium text-slate-800">
                      {report.emissionsTest.noxLevel} ppm
                    </span>
                  </div>
                )}
                {report.emissionsTest?.particulateLevel !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Particulate Level:</span>
                    <span className="font-medium text-slate-800">
                      {report.emissionsTest.particulateLevel} µg/m³
                    </span>
                  </div>
                )}
                {report.emissionsTest?.notes && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-600 block mb-1">Notes:</span>
                    <p className="text-slate-700">
                      {report.emissionsTest.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Noise Level */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-700">
                  Noise Level Test
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.noiseLevel?.passed
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {report.noiseLevel?.passed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {report.noiseLevel?.decibelReading !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Decibel Reading:</span>
                    <span className="font-medium text-slate-800">
                      {report.noiseLevel.decibelReading} dB
                    </span>
                  </div>
                )}
                {report.noiseLevel?.notes && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-600 block mb-1">Notes:</span>
                    <p className="text-slate-700">{report.noiseLevel.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Fuel Efficiency */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-700">
                  Fuel Efficiency
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.fuelEfficiency?.passed
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {report.fuelEfficiency?.passed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {report.fuelEfficiency?.rating && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Rating:</span>
                    <span className="font-medium text-slate-800">
                      {report.fuelEfficiency.rating}
                    </span>
                  </div>
                )}
                {report.fuelEfficiency?.notes && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-600 block mb-1">Notes:</span>
                    <p className="text-slate-700">
                      {report.fuelEfficiency.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Maintenance Status */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-700">
                  Maintenance Status
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.maintenanceStatus?.passed
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {report.maintenanceStatus?.passed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {report.maintenanceStatus?.issues &&
                  report.maintenanceStatus.issues.length > 0 && (
                    <div>
                      <span className="text-slate-600 block mb-2">Issues:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        {report.maintenanceStatus.issues.map(
                          (issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                {report.maintenanceStatus?.notes && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-600 block mb-1">Notes:</span>
                    <p className="text-slate-700">
                      {report.maintenanceStatus.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Safety Compliance */}
            <div className="bg-slate-50 rounded-lg p-4 md:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-700">
                  Safety Compliance
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.safetyCompliance?.passed
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {report.safetyCompliance?.passed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {report.safetyCompliance?.issues &&
                  report.safetyCompliance.issues.length > 0 && (
                    <div>
                      <span className="text-slate-600 block mb-2">Issues:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        {report.safetyCompliance.issues.map(
                          (issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                {report.safetyCompliance?.notes && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-600 block mb-1">Notes:</span>
                    <p className="text-slate-700">
                      {report.safetyCompliance.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations & Required Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recommendations */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Recommendations
              </h3>
              <ul className="space-y-2">
                {report.recommendations.map((rec: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Actions */}
          {report.requiredActions && report.requiredActions.length > 0 && (
            <div className="border border-orange-200 bg-orange-50 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">
                Required Actions
              </h3>
              <ul className="space-y-2">
                {report.requiredActions.map((action: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-orange-800"
                  >
                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
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
