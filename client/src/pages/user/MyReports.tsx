import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyReportsQuery } from "../../redux/features/report/reportApi";
import Tooltip from "../../components/Tooltip";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import { Eye, Search, Edit } from "lucide-react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { format } from "date-fns";

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
// matching ComplianceOverviewCard and the admin Reports page.
const scoreBadgeClass = (score: number) => {
  if (score >= 80) return "bg-[#16785A]/10 text-[#16785A]";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
};

const MyReports = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterCompliance, setFilterCompliance] = useState<string>("all");
  const [filterApproved, setFilterApproved] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  const {
    data: reportsData,
    isLoading,
    isError,
  } = useGetMyReportsQuery({ page, pageSize });

  const handleViewReport = (reportId: string) => {
    navigate(`/user/report-details/${reportId}`);
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
              className="rounded-lg border border-[#0B1F1A]/15 bg-[#F7F6F1] px-4 py-2 text-sm text-[#0B1F1A]/75"
            >
              <option value="all">All Compliance</option>
              <option value="compliant">Compliant</option>
              <option value="non_compliant">Non-Compliant</option>
            </select>

            <select
              value={filterApproved}
              onChange={(e) => setFilterApproved(e.target.value)}
              className="rounded-lg border border-[#0B1F1A]/15 bg-[#F7F6F1] px-4 py-2 text-sm text-[#0B1F1A]/75"
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
                          className="rounded-full p-2 text-[#0B1F1A]/60 transition hover:bg-[#0B1F1A]/[0.06]"
                        >
                          <Eye size={18} />
                        </button>
                      </Tooltip>

                      {!report.isApproved && (
                        <Tooltip text="Edit Report" position="bottom">
                          <button
                            // onClick={() => handleEditReport(report._id)}
                            className="rounded-full p-2 text-amber-600 transition hover:bg-amber-100"
                          >
                            <Edit size={18} />
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

        {/* Pagination Controls */}
        <div className="my-5 flex items-center justify-between">
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
              className="rounded border border-[#0B1F1A]/15 bg-white px-2 py-1 text-sm text-[#0B1F1A]"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination */}
        {reportsData?.pagination && (
          <Pagination
            currentPage={reportsData.pagination.currentPage}
            totalPages={reportsData.pagination.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyReports;
