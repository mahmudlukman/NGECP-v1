import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetAllReportsQuery,
  useApproveInspectionReportMutation,
  useDeleteInspectionReportMutation,
} from "../../redux/features/report/reportApi";
import type { ServerError } from "../../@types";
import Tooltip from "../../components/Tooltip";
import DeleteAlert from "../../components/DeleteAlert";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import { Eye, Trash2, Search, CheckCircle, Edit } from "lucide-react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

interface IReport {
  _id: string;
  inspection: {
    _id: string;
    scheduledDate: string;
    owner: {
      name?: string;
      email?: string;
      companyName?: string;
      accountType?: string;
    };
  };
  generator: {
    _id: string;
    generatorId: string;
    brand: string;
    model: string;
    serialNumber: string;
  };
  inspector: {
    name: string;
    email: string;
  };
  overallCompliance: boolean;
  complianceScore: number;
  isApproved: boolean;
  approvedBy?: {
    name: string;
    email: string;
  };
  approvalDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Compliance score badge: mint/amber/rose three-tier scale,
// matching ComplianceOverviewCard's scoreColor thresholds.
const scoreBadgeClass = (score: number) => {
  if (score >= 80) return "bg-[#16785A]/10 text-[#16785A]";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
};

const Reports = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterCompliance, setFilterCompliance] = useState<string>("all");
  const [filterApproved, setFilterApproved] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null);
  const isAdmin = user?.role === "admin";

  const navigate = useNavigate();

  const {
    data: reportsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllReportsQuery({ page, pageSize });

  const [approveReport, { isLoading: isApproving }] =
    useApproveInspectionReportMutation();
  const [deleteReport] = useDeleteInspectionReportMutation();

  const handleApprove = async (id: string) => {
    try {
      const res = await approveReport({ id, data: {} }).unwrap();
      toast.success(res.message || "Report approved successfully");
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to approve report");
    }
  };

  const handleDeleteClick = (id: string) => setDeleteReportId(id);
  const handleCancelDelete = () => setDeleteReportId(null);
  const handleConfirmDelete = async () => {
    if (!deleteReportId) return;
    try {
      await deleteReport(deleteReportId).unwrap();
      toast.success("Report deleted successfully");
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to delete report");
    } finally {
      setDeleteReportId(null);
    }
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/admin/report-details/${reportId}`);
  };

  const handleEditReport = (reportId: string) => {
    navigate(`/admin/edit-report/${reportId}`);
  };

  const filteredReports = useMemo(() => {
    const reports = reportsData?.reports || [];
    return reports.filter((r: IReport) => {
      if (filterCompliance === "compliant" && !r.overallCompliance)
        return false;
      if (filterCompliance === "non_compliant" && r.overallCompliance)
        return false;

      if (filterApproved === "approved" && !r.isApproved) return false;
      if (filterApproved === "pending" && r.isApproved) return false;

      if (searchTerm.trim() !== "") {
        const search = searchTerm.toLowerCase();
        const generatorId = r.generator?.generatorId?.toLowerCase() || "";
        const brand = r.generator?.brand?.toLowerCase() || "";
        const model = r.generator?.model?.toLowerCase() || "";
        const inspectorName = r.inspector?.name?.toLowerCase() || "";
        const ownerName =
          r.inspection?.owner?.companyName?.toLowerCase() ||
          r.inspection?.owner?.name?.toLowerCase() ||
          "";
        return (
          generatorId.includes(search) ||
          brand.includes(search) ||
          model.includes(search) ||
          inspectorName.includes(search) ||
          ownerName.includes(search)
        );
      }
      return true;
    });
  }, [reportsData, filterCompliance, filterApproved, searchTerm]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loading fullScreen={false} />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <p className="text-rose-600">Failed to load reports.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="my-5 w-full rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-[0_20px_40px_-30px_rgba(11,31,26,0.25)]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-[Newsreader,Georgia,serif] text-2xl font-normal text-[#0B1F1A]/70">
            Inspection{" "}
            <span className="font-medium text-[#0B1F1A]">Reports</span>
          </h1>
        </div>

        {/* Filters + Search */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
            <select
              value={filterCompliance}
              onChange={(e) => setFilterCompliance(e.target.value)}
              className="cursor-pointer rounded-lg border border-[#0B1F1A]/15 bg-[#F7F6F1] px-4 py-2 text-sm text-[#0B1F1A]/75 outline-none"
            >
              <option value="all">All Compliance</option>
              <option value="compliant">Compliant</option>
              <option value="non_compliant">Non-Compliant</option>
            </select>

            <select
              value={filterApproved}
              onChange={(e) => setFilterApproved(e.target.value)}
              className="cursor-pointer rounded-lg border border-[#0B1F1A]/15 bg-[#F7F6F1] px-4 py-2 text-sm text-[#0B1F1A]/75 outline-none"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-64 items-center gap-2 rounded-full border border-[#0B1F1A]/10 bg-[#F7F6F1] px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-[#16785A]/20"
          >
            <Search size={16} className="text-[#0B1F1A]/40" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-[#0B1F1A] outline-none placeholder-[#0B1F1A]/40"
            />
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full overflow-hidden rounded text-left text-sm ring-1 ring-[#0B1F1A]/10">
            <thead className="bg-[#F7F6F1] uppercase tracking-wider text-[#0B1F1A]/50">
              <tr>
                <th className="px-4 py-3">Generator</th>
                <th className="hidden px-4 py-3 md:table-cell">Inspector</th>
                <th className="hidden px-4 py-3 md:table-cell">Owner</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Compliance</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="hidden px-4 py-3 lg:table-cell">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[#0B1F1A]/80">
              {filteredReports.map((report: IReport) => (
                <tr
                  key={report._id}
                  className="border-t border-[#0B1F1A]/10 transition hover:bg-[#0B1F1A]/[0.02]"
                >
                  <td className="px-4 py-3 align-top">
                    <div className="space-y-1 text-xs">
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          ID:
                        </span>{" "}
                        {report.generator?.generatorId || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Brand:
                        </span>{" "}
                        {report.generator?.brand || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Model:
                        </span>{" "}
                        {report.generator?.model || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 align-top md:table-cell">
                    <div className="space-y-1 text-xs">
                      <p className="font-medium text-[#0B1F1A]">
                        {report.inspector?.name || "N/A"}
                      </p>
                      <p className="text-[#0B1F1A]/50">
                        {report.inspector?.email || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 align-top md:table-cell">
                    <div className="space-y-1 text-xs">
                      <p className="font-medium text-[#0B1F1A]">
                        {report.inspection?.owner?.companyName ||
                          report.inspection?.owner?.name ||
                          "N/A"}
                      </p>
                      <p className="text-[#0B1F1A]/50">
                        {report.inspection?.owner?.accountType || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center align-top">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${scoreBadgeClass(
                        report.complianceScore,
                      )}`}
                    >
                      {report.complianceScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center align-top">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        report.overallCompliance
                          ? "bg-[#16785A]/10 text-[#16785A]"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {report.overallCompliance ? "Compliant" : "Non-Compliant"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center align-top">
                    {report.isApproved ? (
                      <div className="space-y-1">
                        <span className="inline-block rounded-full bg-[#0B1F1A]/[0.06] px-3 py-1 text-xs font-semibold text-[#0B1F1A]/70">
                          Approved
                        </span>
                        {report.approvalDate && (
                          <p className="text-xs text-[#0B1F1A]/45">
                            {format(
                              new Date(report.approvalDate),
                              "dd MMM yyyy",
                            )}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 align-top lg:table-cell">
                    <div className="space-y-1 text-xs">
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Created:
                        </span>{" "}
                        {format(new Date(report.createdAt), "dd MMM yyyy")}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Updated:
                        </span>{" "}
                        {format(new Date(report.updatedAt), "dd MMM yyyy")}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Tooltip text="View Report" position="bottom">
                        <button
                          onClick={() => handleViewReport(report._id)}
                          className="cursor-pointer rounded-full p-2 text-[#0B1F1A]/60 transition hover:bg-[#0B1F1A]/[0.06]"
                        >
                          <Eye size={18} />
                        </button>
                      </Tooltip>

                      {!report.isApproved && (
                        <Tooltip text="Edit Report" position="bottom">
                          <button
                            onClick={() => handleEditReport(report._id)}
                            className="cursor-pointer rounded-full p-2 text-amber-600 transition hover:bg-amber-100"
                          >
                            <Edit size={18} />
                          </button>
                        </Tooltip>
                      )}

                      {!report.isApproved && isAdmin && (
                        <Tooltip text="Approve Report" position="bottom">
                          <button
                            onClick={() => handleApprove(report._id)}
                            disabled={isApproving}
                            className="cursor-pointer rounded-full p-2 text-[#16785A] transition hover:bg-[#16785A]/10 disabled:opacity-50"
                          >
                            <CheckCircle size={18} />
                          </button>
                        </Tooltip>
                      )}

                      {isAdmin && (
                        <Tooltip text="Delete Report" position="bottom">
                          <button
                            onClick={() => handleDeleteClick(report._id)}
                            className="cursor-pointer rounded-full p-2 text-rose-500 transition hover:bg-rose-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Results */}
        {filteredReports.length === 0 && (
          <div className="py-8 text-center text-[#0B1F1A]/45">
            No reports found matching your criteria.
          </div>
        )}

        {/* Pagination Controls Info & Size Selector */}
        <div className="my-5 flex flex-wrap items-center justify-between gap-4">
          {reportsData?.pagination && (
            <p className="text-sm text-[#0B1F1A]/55">
              Showing{" "}
              <span className="font-medium text-[#0B1F1A]">
                {(reportsData.pagination.currentPage - 1) * pageSize + 1}
              </span>{" "}
              –{" "}
              <span className="font-medium text-[#0B1F1A]">
                {Math.min(
                  reportsData.pagination.currentPage * pageSize,
                  reportsData.pagination.totalItems,
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[#0B1F1A]">
                {reportsData.pagination.totalItems}
              </span>{" "}
              reports
            </p>
          )}
          <div className="flex items-center gap-2">
            <label
              htmlFor="pageSize"
              className="whitespace-nowrap text-sm text-[#0B1F1A]/55"
            >
              Show:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="cursor-pointer rounded border border-[#0B1F1A]/15 bg-[#F7F6F1] px-2 py-1 text-sm text-[#0B1F1A]/75 outline-none"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination Numbers Component */}
        {reportsData?.pagination && (
          <Pagination
            currentPage={reportsData.pagination.currentPage}
            totalPages={reportsData.pagination.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteReportId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 cursor-pointer bg-[#0B1F1A]/70 backdrop-blur-xs"
              onClick={handleCancelDelete}
            />
            <div className="z-10 mx-4 w-full max-w-sm rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 shadow-[0_40px_80px_-20px_rgba(11,31,26,0.45)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-[Newsreader,Georgia,serif] text-lg font-normal text-[#0B1F1A]">
                  Confirm Deletion
                </h3>
                <button
                  onClick={handleCancelDelete}
                  className="cursor-pointer text-[#0B1F1A]/35 hover:text-[#0B1F1A]/70"
                >
                  ✕
                </button>
              </div>
              <DeleteAlert
                content="Are you sure you want to delete this report? This action cannot be undone and will also remove the report reference from the inspection."
                onDelete={handleConfirmDelete}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
