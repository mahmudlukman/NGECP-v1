import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Building2,
  MapPin,
  Zap,
  AlertTriangle,
  FileText,
  Clock,
  Award,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import type { IInspection, IInspectionReport } from "../@types";
import { useGetGeneratorByIdQuery } from "../redux/features/generator/generatorApi";
import { useGetAllInspectionsQuery } from "../redux/features/inspection/inspectionApi";
import { useGetAllReportsQuery } from "../redux/features/report/reportApi";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import Loading from "../components/Loading";

const GeneratorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: generatorsData,
    isLoading,
    isError,
  } = useGetGeneratorByIdQuery({ id }, { skip: !id });

  // Fetch inspections for this generator
  const { data: inspectionsData, isLoading: isLoadingInspections } =
    useGetAllInspectionsQuery({ page: 1, pageSize: 100 });

  // Fetch reports for this generator
  const { data: reportsData, isLoading: isLoadingReports } =
    useGetAllReportsQuery({ page: 1, pageSize: 100 });

  // Safe object assignment
  const generator = generatorsData?.generator;

  // Filter inspections and reports safely
  const generatorInspections: IInspection[] =
    inspectionsData?.inspections?.filter(
      (inspection: IInspection) =>
        (typeof inspection.generator === "string"
          ? inspection.generator
          : inspection.generator?._id) === id,
    ) || [];

  const generatorReports: IInspectionReport[] =
    reportsData?.reports?.filter(
      (report: IInspectionReport) =>
        (typeof report.generator === "string"
          ? report.generator
          : report.generator?._id) === id,
    ) || [];

  if (isLoading || isLoadingInspections || isLoadingReports) {
    return (
      <DashboardLayout activeMenu="Generators">
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loading />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !generator) {
    return (
      <DashboardLayout activeMenu="Generators">
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Failed to load details
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">
            The generator record could not be found or an API error occurred.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "compliant":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "non_compliant":
        return "bg-rose-50 border-rose-200 text-rose-700";
      case "pending":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "active":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "inactive":
        return "bg-slate-100 border-slate-200 text-slate-600";
      default:
        return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "compliant":
      case "active":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "non_compliant":
        return <XCircle className="w-5 h-5 text-rose-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-slate-500" />;
    }
  };

  // Safe Owner extraction
  const ownerName =
    typeof generator.owner === "object"
      ? generator.owner?.companyName || generator.owner?.name || "N/A"
      : "N/A";

  const ownerEmail =
    typeof generator.owner === "object"
      ? generator.owner?.email || "N/A"
      : "N/A";

  const ownerPhone =
    typeof generator.owner === "object"
      ? generator.owner?.phoneNumber || "N/A"
      : "N/A";

  const ownerAccountType =
    typeof generator.owner === "object"
      ? generator.owner?.accountType || "N/A"
      : "N/A";

  return (
    <DashboardLayout activeMenu="Manage Generators">
      <div className="my-5 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors focus:outline-none"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl text-slate-600 font-medium">
              Generator{" "}
              <span className="text-slate-900 font-bold">Details</span>
            </h1>
          </div>
        </div>

        {/* Status & Overview Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div
            className={`rounded-xl p-4 border ${getStatusColor(generator.status)}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {getStatusIcon(generator.status)}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-75">
                  Status
                </p>
                <p className="text-base font-bold capitalize mt-0.5">
                  {generator.status?.replace("_", " ") || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {generator.complianceScore !== undefined && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Compliance Score
                  </p>
                  <p className="text-base font-bold text-slate-800 mt-0.5">
                    {generator.complianceScore}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {generator.registrationDate && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-100 text-purple-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Registered
                  </p>
                  <p className="text-base font-bold text-slate-800 mt-0.5">
                    {format(
                      new Date(generator.registrationDate),
                      "dd MMM yyyy",
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Basic Details */}
          <div className="border border-slate-200/80 rounded-xl p-5 bg-white">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-slate-500" />
              <h3 className="text-base font-bold text-slate-800">
                Basic Information
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Generator ID:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {generator.generatorId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Brand:</span>
                <span className="font-medium text-slate-800">
                  {generator.brand || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Model:</span>
                <span className="font-medium text-slate-800">
                  {generator.model || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Serial Number:</span>
                <span className="font-mono text-slate-800">
                  {generator.serialNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Year of Manufacture:</span>
                <span className="font-medium text-slate-800">
                  {generator.yearOfManufacture || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Capacity:</span>
                <span className="font-medium text-slate-800">
                  {generator.capacity || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="border border-slate-200/80 rounded-xl p-5 bg-white">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Zap className="w-5 h-5 text-slate-500" />
              <h3 className="text-base font-bold text-slate-800">
                Technical Specifications
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Fuel Type:</span>
                <span className="font-medium text-slate-800 capitalize">
                  {generator.fuelType || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Capacity:</span>
                <span className="font-medium text-slate-800">
                  {generator.capacity || "N/A"}
                </span>
              </div>
              {generator.registrationDate && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Registration Date:</span>
                  <span className="font-medium text-slate-800">
                    {format(
                      new Date(generator.registrationDate),
                      "dd MMM yyyy",
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Owner Information */}
          <div className="border border-slate-200/80 rounded-xl p-5 bg-white">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <User className="w-5 h-5 text-slate-500" />
              <h3 className="text-base font-bold text-slate-800">
                Owner Information
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Name / Org:</span>
                <span className="font-semibold text-slate-800">
                  {ownerName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium text-slate-800">{ownerEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Phone:</span>
                <span className="font-medium text-slate-800">{ownerPhone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Account Type:</span>
                <span className="font-medium text-slate-800 capitalize">
                  {ownerAccountType}
                </span>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="border border-slate-200/80 rounded-xl p-5 bg-white">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <MapPin className="w-5 h-5 text-slate-500" />
              <h3 className="text-base font-bold text-slate-800">
                Location Details
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-500">Address:</span>
                <span className="font-medium text-slate-800 text-right">
                  {generator.location?.address || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">State:</span>
                <span className="font-medium text-slate-800">
                  {generator.location?.state || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">LGA:</span>
                <span className="font-medium text-slate-800">
                  {generator.location?.lga || "N/A"}
                </span>
              </div>
              {generator.location?.coordinates?.latitude &&
                generator.location?.coordinates?.longitude && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-slate-500">Coordinates:</span>
                    <span className="font-mono text-xs text-slate-700">
                      {generator.location.coordinates.latitude},{" "}
                      {generator.location.coordinates.longitude}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Inspection History Overview */}
        <div className="border border-slate-200/80 rounded-xl p-5 mb-8 bg-white">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <FileText className="w-5 h-5 text-slate-500" />
            <h3 className="text-base font-bold text-slate-800">
              Inspection Schedule
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generator.lastInspectionDate && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                <div className="flex items-center gap-2 mb-1 text-slate-500 text-xs font-semibold uppercase">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span>Last Inspection</span>
                </div>
                <p className="text-base font-bold text-slate-800">
                  {format(
                    new Date(generator.lastInspectionDate),
                    "dd MMM yyyy",
                  )}
                </p>
              </div>
            )}

            {generator.nextInspectionDue && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/80">
                <div className="flex items-center gap-2 mb-1 text-amber-700 text-xs font-semibold uppercase">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Next Inspection Due</span>
                </div>
                <p className="text-base font-bold text-amber-900">
                  {format(new Date(generator.nextInspectionDue), "dd MMM yyyy")}
                </p>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200/80">
              <div className="flex items-center gap-2 mb-1 text-blue-700 text-xs font-semibold uppercase">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Total Inspections</span>
              </div>
              <p className="text-base font-bold text-blue-900">
                {generatorInspections.length}
              </p>
            </div>
          </div>
        </div>

        {/* Inspections List */}
        {generatorInspections.length > 0 && (
          <div className="border border-slate-200/80 rounded-xl p-5 mb-8 bg-white">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                Linked Inspections ({generatorInspections.length})
              </h3>
            </div>
            <div className="space-y-3">
              {generatorInspections
                .slice(0, 5)
                .map((inspection: IInspection) => (
                  <div
                    key={inspection._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            inspection.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : inspection.status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : inspection.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {inspection.status}
                        </span>
                        {inspection.scheduledDate && (
                          <span className="text-xs font-medium text-slate-500">
                            {format(
                              new Date(inspection.scheduledDate),
                              "dd MMM yyyy",
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        Inspector:{" "}
                        <span className="font-medium text-slate-800">
                          {inspection.inspector?.name || "Unassigned"}
                        </span>
                      </p>
                      {inspection.payment?.amount && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          Amount Paid: ₦
                          {inspection.payment.amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Reports List */}
        {generatorReports.length > 0 && (
          <div className="border border-slate-200/80 rounded-xl p-5 bg-white">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                Inspection Reports ({generatorReports.length})
              </h3>
            </div>
            <div className="space-y-3">
              {generatorReports.slice(0, 5).map((report: IInspectionReport) => (
                <div
                  key={report._id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          report.overallCompliance
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {report.overallCompliance
                          ? "Compliant"
                          : "Non-Compliant"}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          report.isApproved
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {report.isApproved ? "Approved" : "Pending Review"}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Score: {report.complianceScore}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Inspector:{" "}
                      <span className="font-medium text-slate-800">
                        {report.inspector?.name || "N/A"}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {format(new Date(report.createdAt), "dd MMM yyyy, HH:mm")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/report-details/${report._id}`)}
                    className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                    title="View Report"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GeneratorDetails;
