import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetAllInspectionsQuery,
  useUpdateInspectionStatusMutation,
  useDeleteInspectionMutation,
  useGetInspectionFeesQuery,
  useUpdateInspectionFeesMutation,
} from "../../redux/features/inspection/inspectionApi";
import type { IInspection, ServerError } from "../../@types";
import Tooltip from "../../components/Tooltip";
import DeleteAlert from "../../components/DeleteAlert";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import { Eye, Trash2, FileText, Search, Plus } from "lucide-react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { format } from "date-fns";

interface IInspectionFee {
  _id: string;
  fuelType: string;
  baseRate: number;
  kVARanges: {
    maxKVA: number;
    multiplier: number;
  }[];
  updatedAt: string;
}

const Inspections = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteInspectionId, setDeleteInspectionId] = useState<string | null>(
    null
  );
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [fees, setFees] = useState<IInspectionFee[]>([]);

  const navigate = useNavigate();

  const {
    data: inspectionsData,
    isLoading: isInspectionsLoading,
    isError: isInspectionsError,
    refetch,
  } = useGetAllInspectionsQuery({ page, pageSize });

  const {
    data: feeData,
    isLoading: isFeeLoading,
    isError: isFeeError,
  } = useGetInspectionFeesQuery(undefined);

  const [updateInspectionStatus] = useUpdateInspectionStatusMutation();
  const [deleteInspection] = useDeleteInspectionMutation();
  const [updateInspectionFees, { isLoading: isUpdatingFees }] =
    useUpdateInspectionFeesMutation();

  // Initialize fees state when data is loaded
  useMemo(() => {
    if (feeData?.fees) {
      setFees(feeData.fees);
    }
  }, [feeData]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await updateInspectionStatus({
        id,
        data: { status: newStatus },
      }).unwrap();
      toast.success(res.message || "Inspection status updated");
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to update status");
    }
  };

  const handleDeleteClick = (id: string) => setDeleteInspectionId(id);
  const handleCancelDelete = () => setDeleteInspectionId(null);
  const handleConfirmDelete = async () => {
    if (!deleteInspectionId) return;
    try {
      await deleteInspection(deleteInspectionId).unwrap();
      toast.success("Inspection deleted successfully");
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to delete inspection");
    } finally {
      setDeleteInspectionId(null);
    }
  };

  const handleWriteReport = (inspectionId: string) => {
    navigate(`/admin/write-report/${inspectionId}`);
  };

  const handleFeeChange = (
    index: number,
    field:
      | "baseRate"
      | `kVARanges.${number}.maxKVA`
      | `kVARanges.${number}.multiplier`,
    value: string
  ) => {
    const newFees = [...fees];
    const numValue = value === "" ? Infinity : Number(value);

    // Validate input
    if (isNaN(numValue) && numValue !== Infinity) {
      toast.error("Please enter a valid number");
      return;
    }
    if (numValue < 0) {
      toast.error("Value cannot be negative");
      return;
    }

    if (field.startsWith("kVARanges")) {
      const [rangeIndex, rangeField] = field.split(".");
      newFees[index].kVARanges[Number(rangeIndex)][
        rangeField as "maxKVA" | "multiplier"
      ] = numValue;
    } else {
      newFees[index].baseRate = numValue;
    }
    setFees(newFees);
  };
  const handleSaveFees = async () => {
    try {
      await updateInspectionFees(fees).unwrap();
      toast.success("Inspection fees updated successfully");
      setShowFeeModal(false);
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to update fees");
    }
  };

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

  if (isInspectionsLoading || isFeeLoading) {
    return (
      <DashboardLayout activeMenu="Inspections">
        <Loading />
      </DashboardLayout>
    );
  }

  if (isInspectionsError || isFeeError) {
    return (
      <DashboardLayout activeMenu="Inspections">
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-red-500">Failed to load data.</p>
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
            onClick={() => setShowFeeModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition"
          >
            <Plus size={16} /> Update Inspection Fee
          </button>
        </div>

        {/* Filter + Search */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 text-sm rounded-lg px-4 py-2 text-gray-700 bg-gray-50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full"
          >
            <Search size={16} className="text-slate-600" />
            <input
              type="text"
              placeholder="Search by generator, owner, location, etc."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none placeholder-slate-600"
            />
          </form>
        </div>

        {/* Table */}
        <table className="w-full text-left ring ring-slate-200 rounded overflow-hidden text-sm">
          <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Inspection</th>
              <th className="px-4 py-3 hidden md:table-cell">Generator</th>
              <th className="px-4 py-3 hidden md:table-cell">Owner</th>
              <th className="px-4 py-3 hidden md:table-cell">Location</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {filteredInspections.map((i: IInspection) => (
              <tr
                key={i._id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
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
                <td className="px-4 py-3 hidden md:table-cell align-top">
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {i.location?.address || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">State:</span>{" "}
                      {i.location?.state || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">LGA:</span>{" "}
                      {i.location?.lga || "N/A"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-center align-top">
                  <select
                    value={i.status}
                    onChange={(e) => handleStatusChange(i._id, e.target.value)}
                    className="border border-gray-300 text-sm rounded-lg px-3 py-2 text-gray-700 bg-gray-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-4 py-3 flex gap-3 align-top">
                  <Tooltip text="Write Report" position="bottom">
                    <button
                      onClick={() => handleWriteReport(i._id)}
                      className="p-2 rounded-full hover:bg-green-200 text-green-600 transition"
                    >
                      <FileText size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip text="View Inspection" position="bottom">
                    <button
                      onClick={() =>
                        navigate(`/admin/inspection-details/${i._id}`)
                      }
                      className="p-2 rounded-full hover:bg-blue-200 text-blue-600 transition"
                    >
                      <Eye size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip text="Delete Inspection" position="bottom">
                    <button
                      onClick={() => handleDeleteClick(i._id)}
                      className="p-2 rounded-full hover:bg-red-200 text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
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
                  inspectionsData.pagination.totalItems
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
              className="absolute inset-0 cursor-pointer bg-black/20"
              onClick={handleCancelDelete}
            ></div>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Deletion
                </h3>
                <button
                  onClick={handleCancelDelete}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
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

        {/* Inspection Fee Modal */}
        {showFeeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 cursor-pointer bg-black/20"
              onClick={() => setShowFeeModal(false)}
            ></div>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Update Inspection Fees
                </h3>
                <button
                  onClick={() => setShowFeeModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-6">
                {fees.map((fee, index) => (
                  <div key={fee._id} className="border p-4 rounded-lg">
                    <h4 className="text-md font-medium capitalize">
                      {fee.fuelType}
                    </h4>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Base Rate (₦)
                      </label>
                      <input
                        type="number"
                        value={fee.baseRate}
                        onChange={(e) =>
                          handleFeeChange(index, "baseRate", e.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        min="0"
                      />
                    </div>
                    <div className="mt-4">
                      <h5 className="text-sm font-medium">kVA Ranges</h5>
                      {fee.kVARanges.map((range, rangeIndex) => (
                        <div key={rangeIndex} className="flex gap-4 mt-2">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">
                              Max kVA
                            </label>
                            <input
                              type="number"
                              value={
                                range.maxKVA === Infinity ? "" : range.maxKVA
                              }
                              onChange={(e) =>
                                handleFeeChange(
                                  index,
                                  `kVARanges.${rangeIndex}.maxKVA`,
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                              min="0"
                              placeholder="Infinity"
                              disabled={rangeIndex === fee.kVARanges.length - 1}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">
                              Multiplier (₦/kVA)
                            </label>
                            <input
                              type="number"
                              value={range.multiplier}
                              onChange={(e) =>
                                handleFeeChange(
                                  index,
                                  `kVARanges.${rangeIndex}.multiplier`,
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                              min="0"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowFeeModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFees}
                  className="px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary/90"
                  disabled={isUpdatingFees}
                >
                  {isUpdatingFees ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Inspections;
