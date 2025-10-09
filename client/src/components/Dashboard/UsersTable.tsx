import {
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
} from "../../redux/features/user/userApi";
import { toast } from "react-hot-toast";
import { useState, useEffect, useMemo } from "react";
import type { RootState, ServerError, User } from "../../@types";
import DeleteAlert from "../DeleteAlert";
import { Trash2, Search } from "lucide-react";
import { getInitials } from "../../utils/helper";
import Pagination from "../Pagination";
import { useSelector } from "react-redux";

const UsersTable = ({ usersData }: { usersData: User[] }) => {
  const { user: loggedInUser } = useSelector((state: RootState) => state.auth);
  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const users = useMemo(() => usersData ?? [], [usersData]);
  const isAdmin = loggedInUser?.role === "admin";
//   const isEditor = loggedInUser?.role === "editor";

  // Filter Tabs state
  const [activeTab, setActiveTab] = useState<"all" | "individual" | "company">(
    "all"
  );

  // Filter users based on the active tab
  const filteredByType = useMemo(() => {
    if (activeTab === "individual") {
      return filteredUsers.filter((u) => u.accountType === "individual");
    } else if (activeTab === "company") {
      return filteredUsers.filter((u) => u.accountType === "company");
    }
    return filteredUsers;
  }, [filteredUsers, activeTab]);

  // Apply search filter
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setFilteredUsers(
        users.filter(
          (user: User) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
    setPage(1); // reset when searching
  }, [users, searchQuery]);

  // Pagination logic
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize);
  const indexOfLastUser = page * pageSize;
  const indexOfFirstUser = indexOfLastUser - pageSize;
  //   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const currentUsers = filteredByType.slice(indexOfFirstUser, indexOfLastUser);

  const availableRoles = ["admin", "editor", "user"];

  const handleUserStatusChange = async (
    userId: string,
    newRole?: string,
    isActive?: boolean
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
          "Failed to delete user"
      );
    } finally {
      setDeleteUserId(null);
    }
  };

  const handleCancelDelete = () => setDeleteUserId(null);

  return (
    <div className="overflow-x-auto max-w-6xl rounded-md shadow border border-gray-200 bg-white p-4">
      {/* Tabs and Search Row */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        {/* Tabs for user type filtering */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("individual")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
              activeTab === "individual"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Individual Users
            <span
              className={`ml-1 text-xs ${
                activeTab === "individual" ? "text-white" : "text-gray-500"
              }`}
            >
              ({users.filter((u) => u.accountType === "individual").length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
              activeTab === "company"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Company Users
            <span
              className={`ml-1 text-xs ${
                activeTab === "company" ? "text-white" : "text-gray-500"
              }`}
            >
              ({users.filter((u) => u.accountType === "company").length})
            </span>
          </button>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full"
        >
          <Search size={16} className="text-slate-600" />
          <input
            type="text"
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none placeholder-slate-600"
          />
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        {/* Desktop Table */}
        <table className="hidden md:table w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Initials</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentUsers.map((user) => {
              const initials = getInitials(
                user.name,
                user.accountType,
                user.companyName
              );
              const roleClass =
                user.role === "admin"
                  ? "bg-primary text-white cursor-not-allowed"
                  : user.role === "editor"
                  ? "bg-cyan-500 text-white"
                  : "bg-blue-500 text-white";

              const statusClass = user.isActive
                ? "bg-purple-500 text-white"
                : "bg-red-500 text-white";

              return (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                      {initials}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {user.accountType === "company"
                      ? user.companyName || "N/A"
                      : user.name || "N/A"}
                  </td>
                  <td className="px-4 py-3">{user.email || "N/A"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role || "user"}
                      onChange={(e) =>
                        handleUserStatusChange(user._id, e.target.value)
                      }
                      disabled={!isAdmin || isUpdating}
                      className={`px-2 py-1 text-xs rounded border focus:outline-none cursor-pointer ${roleClass}`}
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
                      value={user.isActive ? "active" : "suspended"}
                      onChange={(e) =>
                        handleUserStatusChange(
                          user._id,
                          undefined,
                          e.target.value === "active"
                        )
                      }
                      disabled={!isAdmin || isUpdating}
                      className={`px-2 py-1 text-xs rounded border cursor-pointer ${statusClass}`}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteClick(user._id)}
                      disabled={!isAdmin || isDeleting}
                      className="p-2 rounded-full hover:bg-red-200 text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {currentUsers.map((user) => {
            const initial = getInitials(user.name);
            const roleClass =
              user.role === "admin"
                ? "bg-primary text-white cursor-not-allowed"
                : "bg-blue-100 text-blue-800";
            const statusClass = user.isActive
              ? "bg-purple-100 text-purple-800"
              : "bg-red-100 text-red-800";

            return (
              <div
                key={user._id}
                className="shadow-md shadow-gray-100 border border-gray-200/50 rounded-md p-4 bg-white space-y-3"
              >
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                    {initial}
                  </div>
                  <div>
                    <p className="font-medium">{user.name || "N/A"}</p>
                    <p className="text-xs text-gray-500">
                      {user.email || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Role + Status */}
                <div className="flex justify-between items-center text-sm">
                  <select
                    value={user.role || "user"}
                    onChange={(e) =>
                      handleUserStatusChange(user._id, e.target.value)
                    }
                    disabled={isUpdating}
                    className={`px-2 py-1 text-xs rounded border focus:outline-none cursor-pointer ${roleClass}`}
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={user.isActive ? "active" : "suspended"}
                    onChange={(e) =>
                      handleUserStatusChange(
                        user._id,
                        undefined,
                        e.target.value === "active"
                      )
                    }
                    disabled={isUpdating}
                    className={`px-2 py-1 text-xs rounded border cursor-pointer ${statusClass}`}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteClick(user._id)}
                    disabled={isDeleting}
                    className="p-2 rounded-full hover:bg-red-200 text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {totalUsers === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No users found</p>
        </div>
      )}

      {/* Pagination footer */}
      {totalUsers > 0 && (
        <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-3">
          {/* Showing x–y of z */}
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
            –{" "}
            <span className="font-medium">
              {Math.min(indexOfLastUser, totalUsers)}
            </span>{" "}
            of <span className="font-medium">{totalUsers}</span> users
          </p>

          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Rows per page:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination controls */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Delete modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 cursor-pointer bg-black/20"
            onClick={handleCancelDelete}
          />
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
