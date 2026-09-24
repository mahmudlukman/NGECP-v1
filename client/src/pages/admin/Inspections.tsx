import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Trash2, FileText, Search, Plus } from "lucide-react";

import {
  useGetAllInspectionsQuery,
  useDeleteInspectionMutation,
  useGetInspectionFeeQuery,
  useUpdateInspectionFeeMutation,
} from "../../redux/features/inspection/inspectionApi";
import type { IInspection, RootState, ServerError } from "../../@types";

import Tooltip from "../../components/Tooltip";
import DeleteAlert from "../../components/DeleteAlert";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Modal from "../../components/Modal";

const Inspections = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  // Table & Filter State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Modal & Mutation State
  const [deleteInspectionId, setDeleteInspectionId] = useState<string | null>(
    null,
  );
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [feeDescription, setFeeDescription] = useState<string>("");

  // RTK Query Hooks
  const {
    data: inspectionsData,
    isLoading: isInspectionsLoading,
    isError: isInspectionsError,
    refetch: refetchInspections,
  } = useGetAllInspectionsQuery({ page, pageSize });

  const {
    data: feeData,
    isLoading: isFeeLoading,
    isError: isFeeError,
    refetch: refetchFee,
  } = useGetInspectionFeeQuery({});

  const [deleteInspection] = useDeleteInspectionMutation();
  const [updateInspectionFees, { isLoading: isUpdatingFees }] =
    useUpdateInspectionFeeMutation();

  // Populate Fee Modal Fields
  useEffect(() => {
    if (isFeeModalOpen && feeData?.fee) {
      setFeeAmount(feeData.fee.amount || 0);
      setFeeDescription(feeData.fee.description || "");
    }
  }, [isFeeModalOpen, feeData]);

  // Handlers: Delete Inspection
  const handleDeleteClick = (id: string) => setDeleteInspectionId(id);
  const handleCancelDelete = () => setDeleteInspectionId(null);

  const handleConfirmDelete = async () => {
    if (!deleteInspectionId) return;
    try {
      await deleteInspection(deleteInspectionId).unwrap();
      toast.success("Inspection deleted successfully");
      refetchInspections();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to delete inspection");
    } finally {
      setDeleteInspectionId(null);
    }
  };

  // Handlers: Fee Updates
  const handleUpdateInspectionFee = async () => {
    try {
      await updateInspectionFees({
        data: { amount: feeAmount, description: feeDescription },
      }).unwrap();
      toast.success("Inspection fee updated successfully");
      refetchFee();
      setIsFeeModalOpen(false);
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError?.data?.message ||
        serverError?.message ||
        "Failed to update inspection fee";
      toast.error(errorMessage);
    }
  };

  const handleWriteReport = (inspectionId: string) => {
    navigate(`/admin/write-report/${inspectionId}`);
  };

  // Filtered Inspections Memo
  const filteredInspections = useMemo(() => {
    const inspections = inspectionsData?.inspections || [];
    return inspections.filter((i: IInspection) => {
      if (filterStatus !== "all" && i.status !== filterStatus) return false;
      if (searchTerm.trim() !== "") {
        const search = searchTerm.toLowerCase();
        const ownerName =
          typeof i.owner === "string"
            ? i.owner.toLowerCase()
            : i.owner?.companyName?.toLowerCase() ||
              i.owner?.name?.toLowerCase() ||
              i.owner?.email?.toLowerCase() ||
              "";
        const address = i.location?.address?.toLowerCase() || "";
        const state = i.location?.state?.toLowerCase() || "";
        const lga = i.location?.lga?.toLowerCase() || "";
        const generator = `${i.generator?.brand || ""} ${
          i.generator?.model || ""
        }`.toLowerCase();

        return (
          i.generator?.generatorId?.toLowerCase().includes(search) ||
          generator.includes(search) ||
          ownerName.includes(search) ||
          address.includes(search) ||
          state.includes(search) ||
          lga.includes(search)
        );
      }
      return true;
    });
  }, [inspectionsData, filterStatus, searchTerm]);

  // Loading State
  if (isInspectionsLoading || isFeeLoading) {
    return (
      <DashboardLayout activeMenu="Inspections">
        <Loading />
      </DashboardLayout>
    );
  }

  // Error State
  if (isInspectionsError || isFeeError) {
    return (
      <DashboardLayout activeMenu="Inspections">
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-red-500">Failed to load inspection data.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Inspections">
      <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-slate-600 font-semibold">
            Manage <span className="text-slate-800 font-bold">Inspections</span>
          </h1>
          <button
            onClick={() => setIsFeeModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition"
          >
            <Plus size={16} /> Update Inspection Fee
          </button>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 text-sm rounded-lg px-4 py-2 text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20"
          >
            <Search size={16} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search generator, owner, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none placeholder-slate-500 text-slate-700"
            />
          </form>
        </div>

        {/* Table */}
        <table className="w-full text-left ring-1 ring-slate-200 rounded-lg overflow-hidden text-sm">
          <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Inspection</th>
              <th className="px-4 py-3 hidden md:table-cell">Generator</th>
              <th className="px-4 py-3 hidden md:table-cell">Owner</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 divide-y divide-gray-200">
            {filteredInspections.map((i: IInspection) => (
              <tr key={i._id} className="hover:bg-gray-50/80 transition">
                <td className="px-4 py-3 align-top">
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="font-semibold">Scheduled:</span>{" "}
                      {i.scheduledDate
                        ? format(new Date(i.scheduledDate), "dd MMM yyyy")
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Amount:</span>{" "}
                      {i.payment?.amount
                        ? `₦${i.payment.amount.toLocaleString()}`
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Last Updated:</span>{" "}
                      {i.updatedAt
                        ? format(new Date(i.updatedAt), "dd MMM yyyy")
                        : "N/A"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell align-top">
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="font-semibold">ID:</span>{" "}
                      {i.generator?.generatorId || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Brand:</span>{" "}
                      {i.generator?.brand || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Model:</span>{" "}
                      {i.generator?.model || "N/A"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell align-top">
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {typeof i.owner === "string"
                        ? i.owner
                        : i.owner?.companyName ||
                          i.owner?.name ||
                          i.owner?.email ||
                          "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Type:</span>{" "}
                      {typeof i.owner === "string"
                        ? "N/A"
                        : i.owner?.accountType || "N/A"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-center align-top">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      i.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : i.status === "scheduled"
                          ? "bg-blue-100 text-blue-700"
                          : i.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {i.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2 align-top">
                  <Tooltip text="Write Report" position="bottom">
                    <button
                      onClick={() => handleWriteReport(i._id)}
                      className="p-2 rounded-full hover:bg-green-100 text-green-600 transition"
                    >
                      <FileText size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip text="Delete Inspection" position="bottom">
                    <button
                      onClick={() => handleDeleteClick(i._id)}
                      className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Summary & Selector */}
        <div className="flex justify-between items-center my-5">
          {inspectionsData?.pagination && (
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {(inspectionsData.pagination.currentPage - 1) * pageSize + 1}
              </span>{" "}
              –{" "}
              <span className="font-medium text-slate-700">
                {Math.min(
                  inspectionsData.pagination.currentPage * pageSize,
                  inspectionsData.pagination.totalItems,
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {inspectionsData.pagination.totalItems}
              </span>{" "}
              inspections
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
              className="border rounded px-2 py-1 text-sm bg-white border-gray-300"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination Control */}
        {inspectionsData?.pagination && (
          <Pagination
            currentPage={inspectionsData.pagination.currentPage}
            totalPages={inspectionsData.pagination.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteInspectionId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 cursor-pointer bg-black/30 backdrop-blur-sm"
              onClick={handleCancelDelete}
            ></div>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Deletion
                </h3>
                <button
                  onClick={handleCancelDelete}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg"
                >
                  ✕
                </button>
              </div>
              <DeleteAlert
                content="Are you sure you want to delete this inspection? This action cannot be undone."
                onDelete={handleConfirmDelete}
              />
            </div>
          </div>
        )}

        {/* Update Inspection Fee Modal */}
        <Modal
          isOpen={isFeeModalOpen}
          onClose={() => setIsFeeModalOpen(false)}
          title="Update Inspection Fee"
        >
          <div className="p-6 space-y-4">
            {isFeeLoading ? (
              <p className="text-center text-gray-500">
                Loading current fee...
              </p>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(Number(e.target.value))}
                    className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={feeDescription}
                    onChange={(e) => setFeeDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setIsFeeModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-slate-600 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!isAdmin || isUpdatingFees}
                    onClick={handleUpdateInspectionFee}
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {isUpdatingFees ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Inspections;
