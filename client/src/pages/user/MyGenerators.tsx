import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useDeleteGeneratorMutation,
  useGetMyGeneratorsQuery,
} from "../../redux/features/generator/generatorApi";
import {
  useScheduleInspectionMutation,
  useCancelInspectionMutation,
  useGetMyInspectionsQuery,
  useGetInspectionFeeQuery,
} from "../../redux/features/inspection/inspectionApi";
import { useInitializePaymentMutation } from "../../redux/features/payment/paymentApi";
import type { IGenerator, IInspection, ServerError } from "../../@types";
import Tooltip from "../../components/Tooltip";
import DeleteAlert from "../../components/DeleteAlert";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import { Pencil, Eye, Trash2, Plus, Search } from "lucide-react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Modal from "../../components/Modal";
import { format } from "date-fns";

const MyGenerators = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteGeneratorId, setDeleteGeneratorId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState<IGenerator | null>(
    null,
  );
  const [scheduledDate, setScheduledDate] = useState("");
  const [amount, setAmount] = useState("");

  const navigate = useNavigate();
  const {
    data: generatorsData,
    isLoading: isGeneratorsLoading,
    isError: isGeneratorsError,
    refetch: refetchGenerators,
  } = useGetMyGeneratorsQuery({ page, pageSize });
  const { data: inspectionsData, isLoading: isInspectionsLoading } =
    useGetMyInspectionsQuery({ status: "pending,scheduled" });
  const { data: feeData } = useGetInspectionFeeQuery({});
  const [deleteGenerator] = useDeleteGeneratorMutation();
  const [scheduleInspection, { isLoading: isScheduling }] =
    useScheduleInspectionMutation();
  const [cancelInspection, { isLoading: isCanceling }] =
    useCancelInspectionMutation();
  const [initializePayment, { isLoading: isInitializingPayment }] =
    useInitializePaymentMutation();

  const pagination = generatorsData?.pagination;

  // Map inspections to generators for quick lookup
  const inspectionMap = useMemo(() => {
    const map = new Map<string, IInspection>();
    if (inspectionsData?.inspections) {
      inspectionsData.inspections.forEach((inspection: IInspection) => {
        if (
          ["pending", "scheduled"].includes(inspection.status) &&
          inspection.generator?._id
        ) {
          map.set(inspection.generator._id.toString(), inspection);
        }
      });
    }
    return map;
  }, [inspectionsData]);

  // Delete Generator
  const handleDeleteClick = (id: string) => setDeleteGeneratorId(id);
  const handleCancelDelete = () => setDeleteGeneratorId(null);
  const handleConfirmDelete = async () => {
    if (!deleteGeneratorId) return;
    try {
      await deleteGenerator(deleteGeneratorId).unwrap();
      toast.success("Generator deleted successfully");
      refetchGenerators();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to delete generator");
    } finally {
      setDeleteGeneratorId(null);
    }
  };

  // Filter and search logic
  const filteredGenerators = useMemo(() => {
    const generators = generatorsData?.generators || [];
    return generators.filter((g: IGenerator) => {
      if (filterStatus !== "all" && g.status !== filterStatus) return false;
      if (searchTerm.trim() !== "") {
        const search = searchTerm.toLowerCase();
        const ownerName =
          typeof g.owner === "string"
            ? g.owner.toLowerCase()
            : g.owner?.organizationName?.toLowerCase() ||
              g.owner?.name?.toLowerCase() ||
              g.owner?.email?.toLowerCase() ||
              "";
        const address = g.location?.address?.toLowerCase() || "";
        const state = g.location?.state?.toLowerCase() || "";
        const lga = g.location?.lga?.toLowerCase() || "";
        return (
          g.generatorId?.toLowerCase().includes(search) ||
          g.brand?.toLowerCase().includes(search) ||
          g.model?.toLowerCase().includes(search) ||
          g.serialNumber?.toLowerCase().includes(search) ||
          ownerName.includes(search) ||
          address.includes(search) ||
          state.includes(search) ||
          lga.includes(search)
        );
      }
      return true;
    });
  }, [generatorsData, filterStatus, searchTerm]);

  useEffect(() => {
    if (feeData?.fee?.amount) {
      setAmount(feeData.fee.amount.toString());
    }
  }, [feeData]);

  // Schedule inspection handler
  const handleScheduleInspection = async () => {
    if (!selectedGenerator || !scheduledDate) {
      toast.error("Please provide all required details");
      return;
    }
    try {
      const res = await scheduleInspection({
        generatorId: selectedGenerator._id,
        scheduledDate,
        amount: Number(amount),
      }).unwrap();
      toast.success(res.message || "Inspection scheduled successfully!");
      setIsModalOpen(false);
      setScheduledDate("");
      setAmount("");
      refetchGenerators();
      inspectionsData?.refetch?.();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to schedule inspection");
    }
  };

  // Cancel inspection handler
  const handleCancelInspection = async (inspectionId: string) => {
    try {
      const res = await cancelInspection(inspectionId).unwrap();
      toast.success(res.message || "Inspection canceled successfully!");
      refetchGenerators();
      inspectionsData?.refetch?.();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to cancel inspection");
    }
  };

  // Proceed to payment handler
  const handleProceedToPayment = async (inspectionId: string) => {
    const inspection = inspectionsData?.inspections.find(
      (insp: IInspection) => insp._id.toString() === inspectionId,
    );
    if (!inspection) {
      toast.error("Inspection not found in client data");
      return;
    }

    const payment = inspection.payment;
    if (!payment) {
      toast.error("No payment associated with this inspection");
      return;
    }

    try {
      const response = await initializePayment({
        inspectionId: inspection._id.toString(),
        amount: payment.amount,
        redirect_url: `${window.location.origin}/payment/callback`,
      }).unwrap();

      if (response.success && response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        toast.error(response.message || "Failed to initialize payment");
      }
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to initialize payment");
    }
  };

  if (isGeneratorsLoading || isInspectionsLoading) {
    return (
      <DashboardLayout>
        <Loading fullScreen={false} />
      </DashboardLayout>
    );
  }

  if (isGeneratorsError) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <p className="text-rose-600">Failed to load generators.</p>
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
            <span className="font-medium text-[#0B1F1A]">Generators</span>
          </h1>
          <button
            onClick={() => navigate("/user/register-generator")}
            className="flex items-center gap-2 rounded-lg bg-[#0B1F1A] px-4 py-2 text-sm text-[#F3F1EA] transition hover:scale-[1.03] active:scale-95"
          >
            <Plus size={16} /> Add New Generator
          </button>
        </div>

        {/* Filter + Search */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-[#0B1F1A]/15 bg-[#F7F6F1] px-4 py-2 text-sm text-[#0B1F1A]/75"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="under_inspection">Under Inspection</option>
            <option value="compliant">Compliant</option>
            <option value="non_compliant">Non-Compliant</option>
          </select>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-64 items-center gap-2 rounded-full border border-[#0B1F1A]/10 bg-[#F7F6F1] px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-[#16785A]/20"
          >
            <Search size={16} className="text-[#0B1F1A]/40" />
            <input
              type="text"
              placeholder="Search by brand, owner, location, etc."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-[#0B1F1A] outline-none placeholder-[#0B1F1A]/40"
            />
          </form>
        </div>

        {/* Table */}
        <table className="w-full overflow-hidden rounded text-left text-sm ring-1 ring-[#0B1F1A]/10">
          <thead className="bg-[#F7F6F1] uppercase tracking-wider text-[#0B1F1A]/50">
            <tr>
              <th className="px-4 py-3">Generator</th>
              <th className="hidden px-4 py-3 md:table-cell">Details</th>
              <th className="hidden px-4 py-3 md:table-cell">Location</th>
              <th className="hidden px-4 py-3 md:table-cell">Compliance</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[#0B1F1A]/80">
            {filteredGenerators.map((g: IGenerator) => {
              const inspection = inspectionMap.get(g._id!.toString());
              const hasScheduledInspection = !!inspection;

              return (
                <tr
                  key={g._id!}
                  className="border-t border-[#0B1F1A]/10 transition hover:bg-[#0B1F1A]/[0.02]"
                >
                  {/* Generator Info */}
                  <td className="px-4 py-3 align-top">
                    <div className="text-xs text-[#0B1F1A]/55">
                      ID:{" "}
                      <span className="font-mono text-[#0B1F1A]/80">
                        {g.generatorId}
                      </span>
                    </div>
                  </td>
                  {/* Details */}
                  <td className="hidden px-4 py-3 align-top md:table-cell">
                    <div className="space-y-1 text-xs">
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Brand:
                        </span>{" "}
                        {g.brand || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Model:
                        </span>{" "}
                        {g.model || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Serial No:
                        </span>{" "}
                        {g.serialNumber || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Capacity:
                        </span>{" "}
                        {g.capacity || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Year:
                        </span>{" "}
                        {g.yearOfManufacture || "N/A"}
                      </p>
                    </div>
                  </td>
                  {/* Location */}
                  <td className="hidden px-4 py-3 align-top md:table-cell">
                    <div className="space-y-1 text-xs">
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Address:
                        </span>{" "}
                        {g.location.address || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          State:
                        </span>{" "}
                        {g.location.state || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          LGA:
                        </span>{" "}
                        {g.location.lga || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Coordinates:
                        </span>{" "}
                        {g.location?.coordinates
                          ? `${g.location.coordinates.latitude}, ${g.location.coordinates.longitude}`
                          : "N/A"}
                      </p>
                    </div>
                  </td>
                  {/* Compliance */}
                  <td className="hidden px-4 py-3 align-top md:table-cell">
                    <div className="space-y-1 text-xs">
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Score:
                        </span>{" "}
                        {g.complianceScore ?? "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Next Inspection:
                        </span>{" "}
                        {g.nextInspectionDue
                          ? format(new Date(g.nextInspectionDue), "dd MMM yyyy")
                          : "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Last Inspection:
                        </span>{" "}
                        {g.lastInspectionDate
                          ? format(
                              new Date(g.lastInspectionDate),
                              "dd MMM yyyy",
                            )
                          : "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0B1F1A]">
                          Registered:
                        </span>{" "}
                        {g.registrationDate
                          ? format(new Date(g.registrationDate), "dd MMM yyyy")
                          : "N/A"}
                      </p>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3 text-center align-top">
                    {hasScheduledInspection &&
                    inspection?.payment?.status === "pending" ? (
                      <div className="flex flex-col gap-2">
                        <Tooltip text="Proceed to Payment" position="bottom">
                          <button
                            onClick={() =>
                              handleProceedToPayment(inspection._id.toString())
                            }
                            disabled={isInitializingPayment}
                            className="flex items-center gap-2 rounded-lg bg-[#16785A] px-4 py-2 text-sm text-white transition hover:scale-[1.03] active:scale-95 disabled:opacity-50"
                          >
                            {isInitializingPayment
                              ? "Initializing..."
                              : "Proceed to Payment"}
                          </button>
                        </Tooltip>
                        <Tooltip text="Cancel Inspection" position="bottom">
                          <button
                            onClick={() =>
                              handleCancelInspection(inspection._id.toString())
                            }
                            disabled={isCanceling}
                            className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm text-white transition hover:scale-[1.03] active:scale-95 disabled:opacity-50"
                          >
                            {isCanceling ? "Canceling..." : "Cancel Inspection"}
                          </button>
                        </Tooltip>
                      </div>
                    ) : (
                      <Tooltip
                        text={
                          hasScheduledInspection &&
                          ["pending", "scheduled"].includes(
                            inspection?.status || "",
                          )
                            ? "Inspection already scheduled"
                            : "Schedule Inspection"
                        }
                        position="bottom"
                      >
                        <button
                          onClick={() => {
                            setSelectedGenerator(g);
                            setIsModalOpen(true);
                          }}
                          disabled={
                            hasScheduledInspection &&
                            ["pending", "scheduled"].includes(
                              inspection?.status || "",
                            )
                          }
                          className="flex items-center gap-2 rounded-lg bg-[#0B1F1A] px-4 py-2 text-sm text-[#F3F1EA] transition hover:scale-[1.03] active:scale-95 disabled:opacity-50"
                        >
                          Schedule Inspection
                        </button>
                      </Tooltip>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="flex gap-3 px-4 py-3 align-top">
                    <Tooltip text="Edit Generator" position="bottom">
                      <button
                        onClick={() =>
                          navigate(`/user/update-my-generator/${g._id}`)
                        }
                        className="rounded-full p-2 text-amber-600 transition hover:bg-amber-100"
                      >
                        <Pencil size={18} />
                      </button>
                    </Tooltip>
                    <Tooltip text="View Generator" position="bottom">
                      <button
                        onClick={() => navigate(`/user/generator/${g._id}`)}
                        className="rounded-full p-2 text-[#0B1F1A]/60 transition hover:bg-[#0B1F1A]/[0.06]"
                      >
                        <Eye size={18} />
                      </button>
                    </Tooltip>
                    <Tooltip text="Delete Generator" position="bottom">
                      <button
                        onClick={() => handleDeleteClick(g._id!)}
                        className="rounded-full p-2 text-rose-500 transition hover:bg-rose-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="my-5 flex items-center justify-between">
          {pagination && (
            <p className="text-sm text-[#0B1F1A]/55">
              Showing{" "}
              <span className="font-medium text-[#0B1F1A]">
                {(pagination.currentPage - 1) * pageSize + 1}
              </span>{" "}
              –{" "}
              <span className="font-medium text-[#0B1F1A]">
                {Math.min(
                  pagination.currentPage * pageSize,
                  pagination.totalItems,
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[#0B1F1A]">
                {pagination.totalItems}
              </span>{" "}
              generators
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
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteGeneratorId && (
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
                content="Are you sure you want to delete this generator? This action cannot be undone."
                onDelete={handleConfirmDelete}
              />
            </div>
          </div>
        )}

        {/* Schedule Inspection Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Schedule Generator Inspection"
        >
          <div className="w-[90vw] p-6 md:w-[400px]">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0B1F1A]/70">
                  Generator ID
                </label>
                <input
                  type="text"
                  value={selectedGenerator?.generatorId || ""}
                  readOnly
                  className="w-full rounded-lg border border-[#0B1F1A]/15 bg-[#0B1F1A]/[0.04] px-3 py-2 text-[#0B1F1A]/70"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0B1F1A]/70">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-lg border border-[#0B1F1A]/15 px-3 py-2 text-[#0B1F1A] focus:border-[#16785A] focus:outline-none focus:ring-2 focus:ring-[#16785A]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0B1F1A]/70">
                  Inspection Amount (₦)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={feeData?.fee?.amount ?? ""}
                  readOnly
                  className="w-full rounded-lg border border-[#0B1F1A]/15 bg-[#0B1F1A]/[0.04] px-3 py-2 text-[#0B1F1A]/70"
                />
              </div>
              <button
                onClick={handleScheduleInspection}
                disabled={isScheduling}
                className="w-full rounded-lg bg-[#0B1F1A] py-2 text-[#F3F1EA] transition hover:bg-[#12332b] disabled:opacity-50"
              >
                {isScheduling ? "Scheduling..." : "Confirm Schedule"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default MyGenerators;
