import {
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
} from "../../redux/features/user/userApi";
import { toast } from "react-hot-toast";
import { useState, useMemo } from "react";
import type { RootState, ServerError, User } from "../../@types";
import DeleteAlert from "../DeleteAlert";
import { Trash2, Search, User as UserIcon, Building2 } from "lucide-react";
import { getInitials } from "../../utils/helper";
import Pagination from "../Pagination";
import { useSelector } from "react-redux";

const UsersTable = ({ usersData }: { usersData: User[] }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "individual" | "company">(
    "all",
  );

  const users = useMemo(() => usersData ?? [], [usersData]);
  const isAdmin = user?.role === "admin";

  // Filter combined search + tab logic in single memo
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        searchQuery.trim().length === 0 ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = activeTab === "all" || u.accountType === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [users, searchQuery, activeTab]);

  // Handlers with page reset
  const handleTabChange = (tab: "all" | "individual" | "company") => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  // Pagination calculations
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize) || 1;
  const indexOfLastUser = page * pageSize;
  const indexOfFirstUser = indexOfLastUser - pageSize;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const availableRoles = ["admin", "editor", "user"];

  const handleUserStatusChange = async (
    userId: string,
    newRole?: string,
    isActive?: boolean,
  ) => {
    try {
      const updateData: { id: string; role?: string; isActive?: boolean } = {
        id: userId,
      };
      if (newRole) updateData.role = newRole;
      if (isActive !== undefined) updateData.isActive = isActive;

      await updateUserStatus({ data: updateData }).unwrap();
      toast.success(`User ${newRole ? "role" : "status"} updated successfully`);
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError?.data?.message ||
        serverError?.message ||
        "Failed to update user status";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (userId: string) => setDeleteUserId(userId);

  const handleConfirmDelete = async () => {
    if (!deleteUserId) return;
    try {
      await deleteUser(deleteUserId).unwrap();
      toast.success("User deleted successfully");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(
        serverError?.data?.message ||
          serverError?.message ||
          "Failed to delete user",
      );
    } finally {
      setDeleteUserId(null);
    }
  };

  const handleCancelDelete = () => setDeleteUserId(null);

  // Styling helper for roles
  const getRoleBadgeClass = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-slate-900 text-slate-100 border-slate-800";
      case "editor":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 font-medium";
    }
  };

  // Styling helper for status
  const getStatusBadgeClass = (isActive?: boolean) => {
    return isActive
      ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold"
      : "bg-rose-50 text-rose-700 border-rose-200/80 font-semibold";
  };

  return (
    <div className="w-full max-w-6xl rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => handleTabChange("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => handleTabChange("individual")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "individual"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserIcon size={13} />
            Individual
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                activeTab === "individual"
                  ? "bg-slate-100 text-slate-800"
                  : "bg-slate-200/60 text-slate-600"
              }`}
            >
              {users.filter((u) => u.accountType === "individual").length}
            </span>
          </button>
          <button
            onClick={() => handleTabChange("company")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "company"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 size={13} />
            Company
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                activeTab === "company"
                  ? "bg-slate-100 text-slate-800"
                  : "bg-slate-200/60 text-slate-600"
              }`}
            >
              {users.filter((u) => u.accountType === "company").length}
            </span>
          </button>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center w-64 text-xs gap-2 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all"
        >
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-transparent outline-none placeholder-slate-400 text-slate-800"
          />
        </form>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto w-full rounded-xl border border-slate-100">
        {/* Desktop View */}
        <table className="hidden md:table w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Account Type</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {currentUsers.map((u) => {
              const initials = getInitials(
                u.name,
                u.accountType,
                u.companyName,
              );
              const displayName =
                u.accountType === "company"
                  ? u.companyName || u.name || "N/A"
                  : u.name || "N/A";

              return (
                <tr
                  key={u._id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100/70 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <span className="font-semibold text-slate-900">
                        {displayName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-500">
                    {u.accountType || "Individual"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {u.email || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role || "user"}
                      onChange={(e) =>
                        handleUserStatusChange(u._id, e.target.value)
                      }
                      disabled={!isAdmin || isUpdating}
                      className={`px-2 py-1 text-[11px] rounded-lg border focus:outline-none cursor-pointer transition-colors ${getRoleBadgeClass(
                        u.role,
                      )}`}
                    >
                      {availableRoles.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.isActive ? "active" : "suspended"}
                      onChange={(e) =>
                        handleUserStatusChange(
                          u._id,
                          undefined,
                          e.target.value === "active",
                        )
                      }
                      disabled={!isAdmin || isUpdating}
                      className={`px-2 py-1 text-[11px] rounded-lg border focus:outline-none cursor-pointer transition-colors ${getStatusBadgeClass(
                        u.isActive,
                      )}`}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDeleteClick(u._id)}
                      disabled={!isAdmin || isDeleting}
                      title="Delete User"
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile View Cards */}
        <div className="space-y-3 md:hidden p-1">
          {currentUsers.map((u) => {
            const initials = getInitials(u.name, u.accountType, u.companyName);
            const displayName =
              u.accountType === "company"
                ? u.companyName || u.name || "N/A"
                : u.name || "N/A";

            return (
              <div
                key={u._id}
                className="border border-slate-200/80 rounded-xl p-4 bg-white space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100/70 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        {displayName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {u.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(u._id)}
                    disabled={!isAdmin || isDeleting}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  <select
                    value={u.role || "user"}
                    onChange={(e) =>
                      handleUserStatusChange(u._id, e.target.value)
                    }
                    disabled={!isAdmin || isUpdating}
                    className={`px-2 py-1 text-xs rounded-lg border ${getRoleBadgeClass(
                      u.role,
                    )}`}
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={u.isActive ? "active" : "suspended"}
                    onChange={(e) =>
                      handleUserStatusChange(
                        u._id,
                        undefined,
                        e.target.value === "active",
                      )
                    }
                    disabled={!isAdmin || isUpdating}
                    className={`px-2 py-1 text-xs rounded-lg border ${getStatusBadgeClass(
                      u.isActive,
                    )}`}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {totalUsers === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm font-medium">No matching users found.</p>
        </div>
      )}

      {/* Pagination Footer */}
      {totalUsers > 0 && (
        <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <p>
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {indexOfFirstUser + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-800">
              {Math.min(indexOfLastUser, totalUsers)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">{totalUsers}</span>{" "}
            users
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-800 outline-none"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={handleCancelDelete}
          />
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full z-10 border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Confirm Deletion
              </h3>
              <button
                onClick={handleCancelDelete}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <DeleteAlert
              content="Are you sure you want to delete this user? This action cannot be undone."
              onDelete={handleConfirmDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
