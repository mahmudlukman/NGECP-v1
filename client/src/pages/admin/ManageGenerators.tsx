import { useState, useMemo } from "react";
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

const ManageGenerators = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteGeneratorId, setDeleteGeneratorId] = useState<string | null>(
    null
  );

  const navigate = useNavigate();

  const {
    data: generatorsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllGeneratorsQuery({ page, pageSize });

  const [updateGeneratorStatus] = useUpdateGeneratorStatusMutation();
  const [deleteGenerator] = useDeleteGeneratorMutation();

  const generators = generatorsData?.generators || [];
  const pagination = generatorsData?.pagination;

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
  const handleCancelDelete = () => setDeleteGeneratorId(null);
  const handleConfirmDelete = async () => {
    if (!deleteGeneratorId) return;
    try {
      await deleteGenerator(deleteGeneratorId).unwrap();
      toast.success("Generator deleted successfully");
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to delete generator");
    } finally {
      setDeleteGeneratorId(null);
    }
  };

  const filteredGenerators = useMemo(() => {
    return generators.filter((g: IGenerator) => {
      // --- Filter by status ---
      if (filterStatus !== "all" && g.status !== filterStatus) return false;

      // --- Search term match ---
      if (searchTerm.trim() !== "") {
        const search = searchTerm.toLowerCase();

        const ownerName =
          typeof g.owner === "string"
            ? g.owner.toLowerCase()
            : g.owner?.companyName?.toLowerCase() ||
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
  }, [generators, filterStatus, searchTerm]);

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="Manage Generators">
        <Loading />
      </DashboardLayout>
    );
  }

  if (isError)
    return (
      <DashboardLayout activeMenu="Manage Generators">
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-red-500">Failed to load generators.</p>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout activeMenu="Manage Generators">
      <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-slate-600 font-semibold">
            Manage <span className="text-slate-800 font-bold">Generators</span>
          </h1>

          <button
            onClick={() => navigate("/admin/register-generator")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition"
          >
            <Plus size={16} /> Add New Generator
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="under_inspection">Under Inspection</option>
            <option value="compliant">Compliant</option>
            <option value="non_compliant">Non-Compliant</option>
          </select>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full"
          >
            <Search size={16} className="text-slate-600" />
            <input
              type="text"
              placeholder="Search by brand, owner, location, etc."
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
              <th className="px-4 py-3">Generator</th>
              <th className="px-4 py-3 hidden md:table-cell">Details</th>
              <th className="px-4 py-3 hidden md:table-cell">Location</th>
              <th className="px-4 py-3 hidden md:table-cell">Compliance</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="text-slate-700">
            {filteredGenerators.map((g: IGenerator) => (
              <tr
                key={g._id!}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                {/* Generator Info */}
                <td className="px-4 py-3 align-top">
                  <p className="text-xs text-slate-500 mt-1">
                    <span className="font-semibold">Owner:</span>{" "}
                    {typeof g.owner === "string"
                      ? g.owner
                      : g.owner?.companyName ||
                        g.owner?.name ||
                        g.owner?.email ||
                        "N/A"}
                  </p>
                  <div className="text-xs text-slate-500">
                    ID:{" "}
                    <span className="font-mono text-slate-700">
                      {g.generatorId}
                    </span>
                  </div>
                </td>

                {/* Details */}
                <td className="px-4 py-3 hidden md:table-cell align-top">
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="font-semibold">Brand:</span>{" "}
                      {g.brand || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Model:</span>{" "}
                      {g.model || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Serial No:</span>{" "}
                      {g.serialNumber || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Capacity:</span>{" "}
                      {g.capacity || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Year:</span>{" "}
                      {g.yearOfManufacture || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Fuel Type:</span>{" "}
                      {g.fuelType || "N/A"}
                    </p>
                  </div>
                </td>

                {/* Location */}
                <td className="px-4 py-3 hidden md:table-cell align-top">
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {g.location.address || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">State:</span>{" "}
                      {g.location.state || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">LGA:</span>{" "}
                      {g.location.lga || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Coordinates:</span>{" "}
                      {g.location?.coordinates
                        ? `${g.location.coordinates.latitude}, ${g.location.coordinates.longitude}`
                        : "N/A"}
                    </p>
                  </div>
                </td>

                {/* Compliance */}
                <td className="px-4 py-3 hidden md:table-cell align-top">
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="font-semibold">Score:</span>{" "}
                      {g.complianceScore ?? "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Next Inspection:</span>{" "}
                      {g.nextInspectionDue
                        ? format(new Date(g.nextInspectionDue), "dd MMM yyyy")
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Last Inspection:</span>{" "}
                      {g.lastInspectionDate
                        ? format(new Date(g.lastInspectionDate), "dd MMM yyyy")
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Registered:</span>{" "}
                      {g.registrationDate
                        ? format(new Date(g.registrationDate), "dd MMM yyyy")
                        : "N/A"}
                    </p>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center align-top">
                  <select
                    value={g.status}
                    onChange={(e) => handleStatusChange(g._id, e.target.value)}
                    className="border border-gray-300 text-sm rounded-lg px-3 py-2 text-gray-700 bg-gray-50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="under_inspection">Under Inspection</option>
                    <option value="compliant">Compliant</option>
                    <option value="non_compliant">Non-Compliant</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 flex gap-3 align-top">
                  <Tooltip text="Edit Generator" position="bottom">
                    <button
                      onClick={() =>
                        navigate(`/admin/update-generator/${g._id}`)
                      }
                      className="p-2 rounded-full hover:bg-yellow-200 text-yellow-600 transition"
                    >
                      <Pencil size={18} />
                    </button>
                  </Tooltip>

                  <Tooltip text="View Generator" position="bottom">
                    <button
                      onClick={() => navigate(`/generators/${g._id}`)}
                      className="p-2 rounded-full hover:bg-blue-200 text-blue-600 transition"
                    >
                      <Eye size={18} />
                    </button>
                  </Tooltip>

                  <Tooltip text="Delete Generator" position="bottom">
                    <button
                      onClick={() => handleDeleteClick(g._id!)}
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
          {pagination && (
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {(pagination.currentPage - 1) * pageSize + 1}
              </span>{" "}
              –{" "}
              <span className="font-medium text-slate-700">
                {Math.min(
                  pagination.currentPage * pageSize,
                  pagination.totalItems
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {pagination.totalItems}
              </span>{" "}
              generators
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
                content="Are you sure you want to delete this generator? This action cannot be undone."
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
