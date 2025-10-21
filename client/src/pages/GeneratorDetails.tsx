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

const GeneratorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: generatorsData,
    isLoading,
    isError,
  } = useGetGeneratorByIdQuery({ id });

  // Fetch inspections for this generator
  const { data: inspectionsData, isLoading: isLoadingInspections } =
    useGetAllInspectionsQuery({ page: 1, pageSize: 100 });

  // Fetch reports for this generator
  const { data: reportsData, isLoading: isLoadingReports } =
    useGetAllReportsQuery({ page: 1, pageSize: 100 });

  // Filter inspections and reports for this generator
  const generatorInspections =
    inspectionsData?.inspections?.filter(
      (inspection: IInspection) => inspection.generator?._id === id
    ) || [];

  const generatorReports =
    reportsData?.reports?.filter(
      (report: IInspectionReport) => report.generator?._id === id
    ) || [];

  if (isLoading || isLoadingInspections || isLoadingReports) {
    return (
      <DashboardLayout activeMenu="Generators">
        <Loading />
      </DashboardLayout>
    );
  }

  if (isError || !generatorsData?.generator) {
    return (
      <DashboardLayout activeMenu="Generators">
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-red-500">Failed to load generator details.</p>
        </div>
      </DashboardLayout>
    );
  }

  const generator = generatorsData?.generator || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-700";
      case "non_compliant":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "active":
        return "bg-blue-100 text-blue-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
      case "active":
        return <CheckCircle size={20} />;
      case "non_compliant":
        return <XCircle size={20} />;
      case "pending":
        return <Clock size={20} />;
      default:
        return <AlertTriangle size={20} />;
    }
  };

  return (
    <DashboardLayout activeMenu="Manage Generators">
      <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/manage-generators")}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl text-slate-600 font-semibold">
              Generator{" "}
              <span className="text-slate-800 font-bold">Details</span>
            </h1>
          </div>
        </div>

        {/* Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className={`rounded-lg p-4 border ${getStatusColor(
              generator.status
            )}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {getStatusIcon(generator.status)}
              </div>
              <div>
                <p className="text-sm font-medium opacity-80">Status</p>
                <p className="text-lg font-bold capitalize">
                  {generator.status?.replace("_", " ") || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {generator.complianceScore !== undefined && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">
                    Compliance Score
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {generator.complianceScore}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {generator.registrationDate && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">
                    Registered
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {format(
                      new Date(generator.registrationDate),
                      "dd MMM yyyy"
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Basic Details */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={20} className="text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Basic Information
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Generator ID:</span>
                <span className="font-medium text-slate-800">
                  {generator.generatorId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Brand:</span>
                <span className="font-medium text-slate-800">
                  {generator.brand || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Model:</span>
                <span className="font-medium text-slate-800">
                  {generator.model || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Serial Number:</span>
                <span className="font-medium text-slate-800">
                  {generator.serialNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Year of Manufacture:</span>
                <span className="font-medium text-slate-800">
                  {generator.yearOfManufacture || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Capacity:</span>
                <span className="font-medium text-slate-800">
                  {generator.capacity || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={20} className="text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Technical Specifications
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Fuel Type:</span>
                <span className="font-medium text-slate-800 capitalize">
                  {generator.fuelType || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Capacity:</span>
                <span className="font-medium text-slate-800">
                  {generator.capacity || "N/A"}
                </span>
              </div>
              {generator.registrationDate && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Registration Date:</span>
                  <span className="font-medium text-slate-800">
                    {format(
                      new Date(generator.registrationDate),
                      "dd MMM yyyy"
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Owner Information */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Owner Information
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 block mb-1">Name:</span>
                <span className="font-medium text-slate-800">
                  {typeof generator.owner === "object"
                    ? generator.owner?.companyName ||
                      generator.owner?.name ||
                      "N/A"
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 block mb-1">Email:</span>
                <span className="font-medium text-slate-800">
                  {typeof generator.owner === "object"
                    ? generator.owner?.email || "N/A"
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 block mb-1">Phone:</span>
                <span className="font-medium text-slate-800">
                  {typeof generator.owner === "object"
                    ? generator.owner?.phoneNumber || "N/A"
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 block mb-1">Account Type:</span>
                <span className="font-medium text-slate-800 capitalize">
                  {typeof generator.owner === "object"
                    ? generator.owner?.accountType || "N/A"
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Location Details
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 mb-1">Address:</span>
                <span className="font-medium text-slate-800">
                  {generator.location?.address || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">State:</span>
                <span className="font-medium text-slate-800">
                  {generator.location?.state || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">LGA:</span>
                <span className="font-medium text-slate-800">
                  {generator.location?.lga || "N/A"}
                </span>
              </div>
              {generator.location?.coordinates?.latitude &&
                generator.location?.coordinates?.longitude && (
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-slate-600 block mb-1">
                      Coordinates:
                    </span>
                    <span className="font-medium text-slate-800 text-xs">
                      Lat: {generator.location.coordinates.latitude}, Lng:{" "}
                      {generator.location.coordinates.longitude}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Inspection History */}
        <div className="border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Inspection History
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generator.lastInspectionDate && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={18} className="text-slate-600" />
                  <span className="text-sm text-slate-600 font-medium">
                    Last Inspection
                  </span>
                </div>
                <p className="text-lg font-bold text-slate-800">
                  {format(
                    new Date(generator.lastInspectionDate),
                    "dd MMM yyyy"
                  )}
                </p>
              </div>
            )}

            {generator.nextInspectionDue && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-orange-600" />
                  <span className="text-sm text-orange-700 font-medium">
                    Next Inspection Due
                  </span>
                </div>
                <p className="text-lg font-bold text-orange-900">
                  {format(new Date(generator.nextInspectionDue), "dd MMM yyyy")}
                </p>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={18} className="text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  Total Inspections
                </span>
              </div>
              <p className="text-lg font-bold text-blue-900">
                {generatorInspections.length}
              </p>
            </div>
          </div>
        </div>

        {/* Inspections List */}
        {generatorInspections.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Inspections ({generatorInspections.length})
              </h3>
            </div>
            <div className="space-y-3">
              {generatorInspections
                .slice(0, 5)
                .map((inspection: IInspection) => (
                  <div
                    key={inspection._id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            inspection.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : inspection.status === "scheduled"
                              ? "bg-blue-100 text-blue-700"
                              : inspection.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {inspection.status}
                        </span>
                        {inspection.scheduledDate && (
                          <span className="text-sm text-slate-600">
                            {format(
                              new Date(inspection.scheduledDate),
                              "dd MMM yyyy"
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700">
                        Inspector: {inspection.inspector?.name || "N/A"}
                      </p>
                      {inspection.payment?.amount && (
                        <p className="text-xs text-slate-500">
                          Amount: ₦{inspection.payment.amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                    {/* <button
                      onClick={() =>
                        navigate(`/admin/inspection-details/${inspection._id}`)
                      }
                      className="p-2 rounded-full hover:bg-blue-200 text-blue-600 transition"
                    >
                      <Eye size={18} />
                    </button> */}
                  </div>
                ))}
              {generatorInspections.length > 5 && (
                <button
                  onClick={() => navigate("/admin/inspections")}
                  className="w-full text-center text-sm text-primary hover:underline py-2"
                >
                  View all {generatorInspections.length} inspections
                </button>
              )}
            </div>
          </div>
        )}

        {/* Reports List */}
        {generatorReports.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Inspection Reports ({generatorReports.length})
              </h3>
            </div>
            <div className="space-y-3">
              {generatorReports.slice(0, 5).map((report: IInspectionReport) => (
                <div
                  key={report._id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.overallCompliance
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {report.overallCompliance
                          ? "Compliant"
                          : "Non-Compliant"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.isApproved
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {report.isApproved ? "Approved" : "Pending"}
                      </span>
                      <span className="text-sm text-slate-600">
                        Score: {report.complianceScore}%
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">
                      Inspector: {report.inspector?.name || "N/A"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {format(new Date(report.createdAt), "dd MMM yyyy, HH:mm")}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/user/report-details/${report._id}`)
                    }
                    className="p-2 rounded-full hover:bg-blue-200 text-blue-600 transition"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              ))}
              {generatorReports.length > 5 && (
                <button
                  onClick={() => navigate("/user/my-reports")}
                  className="w-full text-center text-sm text-primary hover:underline py-2"
                >
                  View all {generatorReports.length} reports
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GeneratorDetails;
