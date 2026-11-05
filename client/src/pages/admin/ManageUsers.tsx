import { useNavigate } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import UsersTable from "../../components/Dashboard/UsersTable";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Loading from "../../components/Loading";
import { useGetAllUsersQuery } from "../../redux/features/user/userApi";

// TODO: point this at your real "add user" route
const ADD_USER_ROUTE = "/admin/register-user";

const NoUsersState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-lg bg-[#F3F1EA]/60 ring-1 ring-[#0B1F1A]/10">
    {/* Faint grid backdrop */}
    <div
      aria-hidden
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage:
          "linear-gradient(#0B1F1A12 1px, transparent 1px), linear-gradient(90deg, #0B1F1A12 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />

    <div className="relative mx-4 max-w-md py-10 text-center">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-[#0B1F1A]/10">
        <Users size={40} strokeWidth={1.75} className="text-[#16785A]" />
      </div>

      <h2 className="font-[Newsreader,Georgia,serif] text-2xl text-[#0B1F1A]">
        No users yet
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#0B1F1A]/60">
        Add a user to give them access to the platform. Once added, they will
        appear in this list where you can manage their accounts.
      </p>

      <button
        onClick={onAdd}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0B1F1A] px-6 py-2.5 text-sm text-[#F3F1EA] transition hover:scale-[1.03] hover:bg-[#12332b] active:scale-95"
      >
        <Plus size={16} /> Add a User
      </button>
    </div>
  </div>
);

const ManageUsers = () => {
  const navigate = useNavigate();
  const { data: usersData, isLoading, isError } = useGetAllUsersQuery({});

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-red-500">Failed to load users.</p>
        </div>
      </DashboardLayout>
    );
  }

  const users = usersData?.users || [];

  return (
    <DashboardLayout>
      <div className="mt-5 mb-10 w-full">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl text-slate-600 font-semibold">
            Manage <span className="text-slate-800 font-bold">Users</span>
          </h1>

          {users.length > 0 && (
            <button
              onClick={() => navigate(ADD_USER_ROUTE)}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#0B1F1A] px-4 py-2 text-sm text-[#F3F1EA] transition hover:bg-[#12332b]"
            >
              <Plus size={16} /> Add User
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
          {users.length === 0 ? (
            <NoUsersState onAdd={() => navigate(ADD_USER_ROUTE)} />
          ) : (
            <UsersTable usersData={users} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
