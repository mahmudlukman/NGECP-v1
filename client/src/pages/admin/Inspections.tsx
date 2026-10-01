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
import type { IInspection, ServerError } from "../../@types";

import Tooltip from "../../components/Tooltip";
import DeleteAlert from "../../components/DeleteAlert";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Modal from "../../components/Modal";
import type { RootState } from "../../redux/store";

// Status badge palette, matching InspectionOverview:
// amber = pending, rose = cancelled, neutral grey = scheduled, mint = completed.
const statusBadgeClasses: Record<string, string> = {
  completed: "bg-[#16785A]/10 text-[#16785A]",
  scheduled: "bg-[#0B1F1A]/[0.06] text-[#0B1F1A]/70",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-rose-100 text-rose-700",
};

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
  } = useGetInspectionFeeQuery({}, { skip: !isAdmin });

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
            : i.owner?.organizationName?.toLowerCase() ||
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
      <DashboardLayout>
        <Loading fullScreen={false} />
      </DashboardLayout>
    );
  }

  // Error State
  if (isInspectionsError || isFeeError) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <p className="text-rose-600">Failed to load inspection data.</p>
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
            Manage{" "}
            <span className="font-medium text-[#0B1F1A]">Inspections</span>
          </h1>
          {isAdmin && (
            <button
              onClick={() => setIsFeeModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#0B1F1A] px-4 py-2 text-sm text-[#F3F1EA] transition hover:bg-[#12332b]"
            >
              <Plus size={16} /> Update Inspection Fee
            </button>
          )}
        </div>

        {/* Filter & Search Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-[#0B1F1A]/15 bg-[#F7F6F1] px-4 py-2 text-sm text-[#0B1F1A]/75 outline-none focus:ring-2 focus:ring-[#16785A]/20"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-64 items-center gap-2 rounded-full border border-[#0B1F1A]/10 bg-[#F7F6F1] px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-[#16785A]/20"
          >
            <Search size={16} className="text-[#0B1F1A]/40" />
            <input
              type="text"
              placeholder="Search generator, owner, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-[#0B1F1A] outline-none placeholder-[#0B1F1A]/40"
            />
          </form>
        </div>

        {/* Table */}
        <table className="w-full overflow-hidden rounded-lg text-left text-sm ring-1 ring-[#0B1F1A]/10">
          <thead className="bg-[#F7F6F1] text-xs font-semibold uppercase tracking-wider text-[#0B1F1A]/50">
            <tr>
              <th className="px-4 py-3">Inspection</th>
              <th className="hidden px-4 py-3 md:table-cell">Generator</th>
              <th className="hidden px-4 py-3 md:table-cell">Owner</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0B1F1A]/10 text-[#0B1F1A]/80">
            {filteredInspections.map((i: IInspection) => (
              <tr key={i._id} className="transition hover:bg-[#0B1F1A]/[0.02]">
                <td className="px-4 py-3 align-top">
                  <div className="space-y-1 text-xs">
                    <p>
                      <span className="font-semibold text-[#0B1F1A]">
                        Scheduled:
                      </span>{" "}
                      {i.scheduledDate
                        ? format(new Date(i.scheduledDate), "dd MMM yyyy")
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-[#0B1F1A]">
                        Amount:
                      </span>{" "}
                      {i.payment?.amount
                        ? `₦${i.payment.amount.toLocaleString()}`
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-[#0B1F1A]">
                        Last Updated:
                      </span>{" "}
                      {i.updatedAt
                        ? format(new Date(i.updatedAt), "dd MMM yyyy")
                        : "N/A"}
                    </p>
                  </div>
                </td>
                <td className="hidden px-4 py-3 align-top md:table-cell">
                  <div className="space-y-1 text-xs">
                    <p>
                      <span className="font-semibold text-[#0B1F1A]">ID:</span>{" "}
                      {i.generator?.generatorId || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-[#0B1F1A]">
                        Brand:
                      </span>{" "}
                      {i.generator?.brand || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-[#0B1F1A]">
                        Model:
                      </span>{" "}
                      {i.generator?.model || "N/A"}
                    </p>
                  </div>
                </td>
                <td className="hidden px-4 py-3 align-top md:table-cell">
                  <div className="space-y-1 text-xs">
                    <p>
                      <span className="font-semibold text-[#0B1F1A]">
                        Name:
                      </span>{" "}
                      {typeof i.owner === "string"
                        ? i.owner
                        : i.owner?.organizationName ||
                          i.owner?.name ||
                          i.owner?.email ||
                          "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-[#0B1F1A]">
                        Type:
                      </span>{" "}
                      {typeof i.owner === "string"
                        ? "N/A"
                        : i.owner?.accountType || "N/A"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-center align-top">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      statusBadgeClasses[i.status] ||
                      statusBadgeClasses.cancelled
                    }`}
                  >
                    {i.status}
                  </span>
                </td>
                <td className="flex gap-2 px-4 py-3 align-top">
                  <Tooltip text="Write Report" position="bottom">
                    <button
                      onClick={() => handleWriteReport(i._id)}
                      className="rounded-full p-2 text-[#16785A] transition hover:bg-[#16785A]/10"
                    >
                      <FileText size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip text="Delete Inspection" position="bottom">
                    <button
                      onClick={() => handleDeleteClick(i._id)}
                      className="rounded-full p-2 text-rose-500 transition hover:bg-rose-100"
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
        <div className="my-5 flex items-center justify-between">
          {inspectionsData?.pagination && (
            <p className="text-sm text-[#0B1F1A]/55">
              Showing{" "}
              <span className="font-medium text-[#0B1F1A]">
                {(inspectionsData.pagination.currentPage - 1) * pageSize + 1}
              </span>{" "}
              –{" "}
              <span className="font-medium text-[#0B1F1A]">
                {Math.min(
                  inspectionsData.pagination.currentPage * pageSize,
                  inspectionsData.pagination.totalItems,
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[#0B1F1A]">
                {inspectionsData.pagination.totalItems}
              </span>{" "}
              inspections
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
              className="absolute inset-0 cursor-pointer bg-[#0B1F1A]/70 backdrop-blur-sm"
              onClick={handleCancelDelete}
            />
            <div className="z-10 mx-4 w-full max-w-sm rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 shadow-[0_40px_80px_-20px_rgba(11,31,26,0.45)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-[Newsreader,Georgia,serif] text-lg font-normal text-[#0B1F1A]">
                  Confirm Deletion
                </h3>
                <button
                  onClick={handleCancelDelete}
                  className="cursor-pointer text-lg text-[#0B1F1A]/35 hover:text-[#0B1F1A]/70"
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
          <div className="space-y-4 p-6">
            {isFeeLoading ? (
              <p className="text-center text-[#0B1F1A]/50">
                Loading current fee...
              </p>
            ) : (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0B1F1A]/70">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#0B1F1A]/15 px-3 py-2 text-[#0B1F1A] focus:border-[#16785A] focus:outline-none focus:ring-2 focus:ring-[#16785A]/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0B1F1A]/70">
                    Description
                  </label>
                  <textarea
                    value={feeDescription}
                    onChange={(e) => setFeeDescription(e.target.value)}
                    className="h-24 w-full resize-none rounded-lg border border-[#0B1F1A]/15 px-3 py-2 text-[#0B1F1A] focus:border-[#16785A] focus:outline-none focus:ring-2 focus:ring-[#16785A]/20"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-[#0B1F1A]/10 pt-4">
                  <button
                    onClick={() => setIsFeeModalOpen(false)}
                    className="rounded-lg border border-[#0B1F1A]/15 px-4 py-2 text-[#0B1F1A]/70 transition hover:bg-[#0B1F1A]/[0.04]"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!isAdmin || isUpdatingFees}
                    onClick={handleUpdateInspectionFee}
                    className="rounded-lg bg-[#0B1F1A] px-4 py-2 text-[#F3F1EA] transition hover:bg-[#12332b] disabled:opacity-50"
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
