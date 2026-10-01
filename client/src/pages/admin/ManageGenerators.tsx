import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetAllGeneratorsQuery,
  useUpdateGeneratorStatusMutation,
  useDeleteGeneratorMutation,
} from "../../redux/features/generator/generatorApi";
import type { IGenerator, ServerError } from "../../@types";
import Tooltip from "../../components/Tooltip";
import DeleteAlert from "../../components/DeleteAlert";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import { Pencil, Eye, Trash2, Plus, Search } from "lucide-react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const ManageGenerators = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [deleteGeneratorId, setDeleteGeneratorId] = useState<string | null>(
    null,
  );

  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  // Handle search debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: generatorsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllGeneratorsQuery({
    page,
    pageSize,
    status: filterStatus !== "all" ? filterStatus : undefined,
    search: debouncedSearch.trim() || undefined,
  });

  const [updateGeneratorStatus] = useUpdateGeneratorStatusMutation();
  const [deleteGenerator, { isLoading: isDeleting }] =
    useDeleteGeneratorMutation();

  const pagination = generatorsData?.pagination;
  const generators = generatorsData?.generators || [];

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await updateGeneratorStatus({
        id,
        data: { status: newStatus },
      }).unwrap();
      toast.success(res.message || "Generator status updated");
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const message =
        serverError.data?.message ||
        serverError.message ||
        "Failed to update status";
      toast.error(message);
    }
  };

  const handleDeleteClick = (id: string) => setDeleteGeneratorId(id);
  const handleCancelDelete = () => {
    if (isDeleting) return;
    setDeleteGeneratorId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteGeneratorId) return;
    try {
      await deleteGenerator(deleteGeneratorId).unwrap();
      toast.success("Generator deleted successfully");
      setDeleteGeneratorId(null);
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to delete generator");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loading fullScreen={false} />
      </DashboardLayout>
    );
  }

  if (isError)
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <p className="text-rose-600">Failed to load generators.</p>
        </div>
      </DashboardLayout>
    );

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
            onClick={() => navigate("/admin/register-generator")}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#0B1F1A] px-4 py-2 text-sm text-[#F3F1EA] transition hover:bg-[#12332b]"
          >
            <Plus size={16} /> Add New Generator
          </button>
        </div>

        {/* Filter + Search */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[#0B1F1A]/15 bg-[#F7F6F1] px-4 py-2 text-sm text-[#0B1F1A]/75 focus:outline-none focus:ring-1 focus:ring-[#16785A]"
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
              placeholder="Search brand, owner, state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-[#0B1F1A] outline-none placeholder-[#0B1F1A]/40"
            />
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg ring-1 ring-[#0B1F1A]/10">
          <table className="w-full text-left text-sm">
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

            <tbody className="divide-y divide-[#0B1F1A]/10 text-[#0B1F1A]/80">
              {generators.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-[#0B1F1A]/45"
                  >
                    No generators found matching your criteria.
                  </td>
                </tr>
              ) : (
                generators.map((g: IGenerator) => (
                  <tr
                    key={g._id!}
                    className="transition hover:bg-[#0B1F1A]/[0.02]"
                  >
                    {/* Generator Info */}
                    <td className="px-4 py-3 align-top">
                      <p className="mt-1 text-xs text-[#0B1F1A]/55">
                        <span className="font-semibold text-[#0B1F1A]">
                          Owner:
                        </span>{" "}
                        {typeof g.owner === "string"
                          ? g.owner
                          : g.owner?.organizationName ||
                            g.owner?.name ||
                            g.owner?.email ||
                            "N/A"}
                      </p>
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
                          {g.capacity || "N/A"}KVA
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
                          {g.location?.address || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#0B1F1A]">
                            State:
                          </span>{" "}
                          {g.location?.state || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#0B1F1A]">
                            LGA:
                          </span>{" "}
                          {g.location?.lga || "N/A"}
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
                            ? format(
                                new Date(g.nextInspectionDue),
                                "dd MMM yyyy",
                              )
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
                            ? format(
                                new Date(g.registrationDate),
                                "dd MMM yyyy",
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center align-top">
                      <select
                        value={g.status}
                        onChange={(e) =>
                          handleStatusChange(g._id, e.target.value)
                        }
                        className="rounded-lg border border-[#0B1F1A]/15 bg-[#F7F6F1] px-3 py-2 text-sm text-[#0B1F1A]/75 focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="under_inspection">
                          Under Inspection
                        </option>
                        <option value="compliant">Compliant</option>
                        <option value="non_compliant">Non-Compliant</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <Tooltip text="Edit Generator" position="bottom">
                          <button
                            onClick={() =>
                              navigate(`/admin/update-generator/${g._id}`)
                            }
                            className="cursor-pointer rounded-full p-2 text-amber-600 transition hover:bg-amber-100"
                          >
                            <Pencil size={18} />
                          </button>
                        </Tooltip>

                        <Tooltip text="View Generator" position="bottom">
                          <button
                            onClick={() =>
                              navigate(`/admin/generator/${g._id}`)
                            }
                            className="cursor-pointer rounded-full p-2 text-[#0B1F1A]/60 transition hover:bg-[#0B1F1A]/[0.06]"
                          >
                            <Eye size={18} />
                          </button>
                        </Tooltip>

                        <Tooltip text="Delete Generator" position="bottom">
                          <button
                            disabled={!isAdmin}
                            onClick={() => handleDeleteClick(g._id!)}
                            className={`rounded-full p-2 transition ${
                              isAdmin
                                ? "cursor-pointer text-rose-600 hover:bg-rose-100"
                                : "cursor-not-allowed text-[#0B1F1A]/25 opacity-50"
                            }`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="my-5 flex flex-wrap items-center justify-between gap-4">
          {pagination && (
            <p className="text-sm text-[#0B1F1A]/55">
              Showing{" "}
              <span className="font-medium text-[#0B1F1A]">
                {pagination.totalItems === 0
                  ? 0
                  : (pagination.currentPage - 1) * pageSize + 1}
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
              className="rounded border border-[#0B1F1A]/15 bg-[#F7F6F1] px-2 py-1 text-sm text-[#0B1F1A]/75 focus:outline-none"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination Component */}
        {pagination && pagination.totalPages > 1 && (
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
                  disabled={isDeleting}
                  className="cursor-pointer text-[#0B1F1A]/35 hover:text-[#0B1F1A]/70"
                >
                  ✕
                </button>
              </div>
              <DeleteAlert
                content={
                  isDeleting
                    ? "Deleting generator..."
                    : "Are you sure you want to delete this generator? This action cannot be undone."
                }
                onDelete={handleConfirmDelete}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageGenerators;
