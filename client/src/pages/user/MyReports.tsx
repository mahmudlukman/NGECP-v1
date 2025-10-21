import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetMyReportsQuery,
} from "../../redux/features/report/reportApi";
import Tooltip from "../../components/Tooltip";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import {
  Eye,
  Search,
  Edit,
} from "lucide-react";
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
      if (
        filterCompliance === "compliant" &&
        !r.overallCompliance
      )
        return false;
      if (
        filterCompliance === "non_compliant" &&
        r.overallCompliance
      )
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
      <DashboardLayout activeMenu="Reports">
        <Loading />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout activeMenu="Reports">
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-red-500">Failed to load reports.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Reports">
      <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-slate-600 font-semibold">
            Inspection <span className="text-slate-800 font-bold">Reports</span>
          </h1>
        </div>

        {/* Filters + Search */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex gap-4">
            <select
              value={filterCompliance}
              onChange={(e) => setFilterCompliance(e.target.value)}
              className="border border-gray-300 text-sm rounded-lg px-4 py-2 text-gray-700 bg-gray-50"
            >
              <option value="all">All Compliance</option>
              <option value="compliant">Compliant</option>
              <option value="non_compliant">Non-Compliant</option>
            </select>

            <select
              value={filterApproved}
              onChange={(e) => setFilterApproved(e.target.value)}
              className="border border-gray-300 text-sm rounded-lg px-4 py-2 text-gray-700 bg-gray-50"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full"
          >
            <Search size={16} className="text-slate-600" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none placeholder-slate-600"
            />
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left ring ring-slate-200 rounded overflow-hidden text-sm">
            <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Generator</th>
                <th className="px-4 py-3 hidden md:table-cell">Inspector</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Compliance</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {filteredReports.map((report: IReport) => (
                <tr
                  key={report._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 align-top">
                    <div className="text-xs space-y-1">
                      <p>
                        <span className="font-semibold">ID:</span>{" "}
                        {report.generator?.generatorId || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Brand:</span>{" "}
                        {report.generator?.brand || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Model:</span>{" "}
                        {report.generator?.model || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell align-top">
                    <div className="text-xs space-y-1">
                      <p className="font-medium">
                        {report.inspector?.name || "N/A"}
                      </p>
                      <p className="text-slate-500">
                        {report.inspector?.email || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center align-top">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        report.complianceScore >= 80
                          ? "bg-green-100 text-green-700"
                          : report.complianceScore >= 60
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {report.complianceScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center align-top">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        report.overallCompliance
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {report.overallCompliance ? "Compliant" : "Non-Compliant"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center align-top">
                    {report.isApproved ? (
                      <div className="space-y-1">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          Approved
                        </span>
                        {report.approvalDate && (
                          <p className="text-xs text-slate-500">
                            {format(new Date(report.approvalDate), "dd MMM yyyy")}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell align-top">
                    <div className="text-xs space-y-1">
                      <p>
                        <span className="font-semibold">Created:</span>{" "}
                        {format(new Date(report.createdAt), "dd MMM yyyy")}
                      </p>
                      <p>
                        <span className="font-semibold">Updated:</span>{" "}
                        {format(new Date(report.updatedAt), "dd MMM yyyy")}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex gap-2 flex-wrap">
                      <Tooltip text="View Report" position="bottom">
                        <button
                          onClick={() => handleViewReport(report._id)}
                          className="p-2 rounded-full hover:bg-blue-200 text-blue-600 transition"
                        >
                          <Eye size={18} />
                        </button>
                      </Tooltip>

                      {!report.isApproved && (
                        <Tooltip text="Edit Report" position="bottom">
                          <button
                            // onClick={() => handleEditReport(report._id)}
                            className="p-2 rounded-full hover:bg-yellow-200 text-yellow-600 transition"
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
          <div className="text-center py-8 text-slate-500">
            No reports found matching your criteria.
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center my-5">
          {reportsData?.pagination && (
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {(reportsData.pagination.currentPage - 1) * pageSize + 1}
              </span>{" "}
              –{" "}
              <span className="font-medium text-slate-700">
                {Math.min(
                  reportsData.pagination.currentPage * pageSize,
                  reportsData.pagination.totalItems
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {reportsData.pagination.totalItems}
              </span>{" "}
              reports
            </p>
          )}
          <div className="flex items-center gap-2">
            <label
              htmlFor="pageSize"
              className="text-sm text-gray-600 whitespace-nowrap"
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
              className="border rounded px-2 py-1 text-sm"
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