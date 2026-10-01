import {
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
} from "../../redux/features/user/userApi";
import { toast } from "react-hot-toast";
import { useState, useMemo } from "react";
import type { ServerError, User } from "../../@types";
import DeleteAlert from "../DeleteAlert";
import { Trash2, Search, User as UserIcon, Building2 } from "lucide-react";
import { getInitials } from "../../utils/helper";
import Pagination from "../Pagination";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const YouBadge = () => (
  <span className="rounded-full bg-[#16785A]/10 px-2 py-0.5 text-[10px] font-medium text-[#16785A]">
    You
  </span>
);

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
    // Prevent the logged-in admin from changing their own role/status
    if (userId === user?._id) {
      toast.error(
        newRole
          ? "You cannot change your own role."
          : "You cannot suspend your own account.",
      );
      return;
    }

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

  const handleDeleteClick = (userId: string) => {
    if (userId === user?._id) {
      toast.error("You cannot delete your own account.");
      return;
    }
    setDeleteUserId(userId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteUserId) return;

    if (deleteUserId === user?._id) {
      toast.error("You cannot delete your own account.");
      setDeleteUserId(null);
      return;
    }

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
        return "bg-[#0B1F1A] text-[#F3F1EA] border-[#0B1F1A]";
      case "editor":
        return "bg-[#16785A]/10 text-[#16785A] border-[#16785A]/25 font-medium";
      default:
        return "bg-[#0B1F1A]/[0.04] text-[#0B1F1A]/70 border-[#0B1F1A]/10 font-medium";
    }
  };

  // Styling helper for status
  const getStatusBadgeClass = (isActive?: boolean) => {
    return isActive
      ? "bg-[#16785A]/10 text-[#16785A] border-[#16785A]/25 font-semibold"
      : "bg-rose-50 text-rose-700 border-rose-200/80 font-semibold";
  };

  return (
    <div className="w-full max-w-6xl rounded-2xl border border-[#0B1F1A]/10 bg-white p-5 font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-xs">
      {/* Filter Tabs and Search Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-xl bg-[#0B1F1A]/[0.04] p-1">
          <button
            onClick={() => handleTabChange("all")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-white text-[#0B1F1A] shadow-xs"
                : "text-[#0B1F1A]/55 hover:text-[#0B1F1A]"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => handleTabChange("individual")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "individual"
                ? "bg-white text-[#0B1F1A] shadow-xs"
                : "text-[#0B1F1A]/55 hover:text-[#0B1F1A]"
            }`}
          >
            <UserIcon size={13} />
            Individual
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                activeTab === "individual"
                  ? "bg-[#0B1F1A]/[0.06] text-[#0B1F1A]/70"
                  : "bg-[#0B1F1A]/[0.06] text-[#0B1F1A]/50"
              }`}
            >
              {users.filter((u) => u.accountType === "individual").length}
            </span>
          </button>
          <button
            onClick={() => handleTabChange("company")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "company"
                ? "bg-white text-[#0B1F1A] shadow-xs"
                : "text-[#0B1F1A]/55 hover:text-[#0B1F1A]"
            }`}
          >
            <Building2 size={13} />
            Company
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                activeTab === "company"
                  ? "bg-[#0B1F1A]/[0.06] text-[#0B1F1A]/70"
                  : "bg-[#0B1F1A]/[0.06] text-[#0B1F1A]/50"
              }`}
            >
              {users.filter((u) => u.accountType === "company").length}
            </span>
          </button>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-64 items-center gap-2 rounded-xl border border-[#0B1F1A]/10 bg-[#F7F6F1] px-3 py-2 text-xs transition-all focus-within:border-[#16785A] focus-within:ring-1 focus-within:ring-[#16785A]/20"
        >
          <Search size={15} className="shrink-0 text-[#0B1F1A]/35" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-transparent text-[#0B1F1A] outline-none placeholder-[#0B1F1A]/35"
          />
        </form>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto rounded-xl border border-[#0B1F1A]/10">
        {/* Desktop View */}
        <table className="hidden w-full text-left text-xs md:table">
          <thead className="border-b border-[#0B1F1A]/10 bg-[#F7F6F1] font-semibold uppercase tracking-wider text-[#0B1F1A]/45">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Account Type</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0B1F1A]/10 text-[#0B1F1A]/80">
            {currentUsers.map((u) => {
              const isSelf = u._id === user?._id;
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
                  className="transition-colors hover:bg-[#0B1F1A]/[0.02]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#16785A]/10 font-bold text-[#16785A]">
                        {initials}
                      </div>
                      <span className="font-semibold text-[#0B1F1A]">
                        {displayName}
                      </span>
                      {isSelf && <YouBadge />}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-[#0B1F1A]/55">
                    {u.accountType || "Individual"}
                  </td>
                  <td className="px-4 py-3 text-[#0B1F1A]/65">
                    {u.email || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role || "user"}
                      onChange={(e) =>
                        handleUserStatusChange(u._id, e.target.value)
                      }
                      disabled={!isAdmin || isUpdating || isSelf}
                      title={isSelf ? "You cannot change your own role" : ""}
                      className={`cursor-pointer rounded-lg border px-2 py-1 text-[11px] transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${getRoleBadgeClass(
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
                      disabled={!isAdmin || isUpdating || isSelf}
                      title={
                        isSelf ? "You cannot suspend your own account" : ""
                      }
                      className={`cursor-pointer rounded-lg border px-2 py-1 text-[11px] transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${getStatusBadgeClass(
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
                      disabled={!isAdmin || isDeleting || isSelf}
                      title={
                        isSelf
                          ? "You cannot delete your own account"
                          : "Delete User"
                      }
                      className="rounded-lg p-1.5 text-[#0B1F1A]/35 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#0B1F1A]/35"
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
        <div className="space-y-3 p-1 md:hidden">
          {currentUsers.map((u) => {
            const isSelf = u._id === user?._id;
            const initials = getInitials(u.name, u.accountType, u.companyName);
            const displayName =
              u.accountType === "company"
                ? u.companyName || u.name || "N/A"
                : u.name || "N/A";

            return (
              <div
                key={u._id}
                className="space-y-3 rounded-xl border border-[#0B1F1A]/10 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16785A]/10 text-xs font-bold text-[#16785A]">
                      {initials}
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-[#0B1F1A]">
                        {displayName}
                        {isSelf && <YouBadge />}
                      </p>
                      <p className="text-xs text-[#0B1F1A]/55">
                        {u.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(u._id)}
                    disabled={!isAdmin || isDeleting || isSelf}
                    title={
                      isSelf
                        ? "You cannot delete your own account"
                        : "Delete User"
                    }
                    className="rounded-lg p-1.5 text-[#0B1F1A]/35 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#0B1F1A]/35"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-[#0B1F1A]/10 pt-2">
                  <select
                    value={u.role || "user"}
                    onChange={(e) =>
                      handleUserStatusChange(u._id, e.target.value)
                    }
                    disabled={!isAdmin || isUpdating || isSelf}
                    className={`rounded-lg border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-60 ${getRoleBadgeClass(
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
                    disabled={!isAdmin || isUpdating || isSelf}
                    className={`rounded-lg border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-60 ${getStatusBadgeClass(
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
        <div className="py-12 text-center text-[#0B1F1A]/35">
          <p className="text-sm font-medium">No matching users found.</p>
        </div>
      )}

      {/* Pagination Footer */}
      {totalUsers > 0 && (
        <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-[#0B1F1A]/10 pt-4 text-xs text-[#0B1F1A]/55 sm:flex-row">
          <p>
            Showing{" "}
            <span className="font-semibold text-[#0B1F1A]">
              {indexOfFirstUser + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[#0B1F1A]">
              {Math.min(indexOfLastUser, totalUsers)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#0B1F1A]">{totalUsers}</span>{" "}
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
                className="rounded-lg border border-[#0B1F1A]/15 bg-white px-2 py-1 text-[#0B1F1A] outline-none"
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
            className="absolute inset-0 bg-[#0B1F1A]/70 backdrop-blur-xs transition-opacity"
            onClick={handleCancelDelete}
          />
          <div className="z-10 w-full max-w-sm rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 shadow-[0_40px_80px_-20px_rgba(11,31,26,0.45)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-[Newsreader,Georgia,serif] text-base font-normal text-[#0B1F1A]">
                Confirm Deletion
              </h3>
              <button
                onClick={handleCancelDelete}
                className="text-sm font-bold text-[#0B1F1A]/35 hover:text-[#0B1F1A]/70"
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
