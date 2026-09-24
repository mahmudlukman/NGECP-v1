import UsersTable from "../../components/Dashboard/UsersTable";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Loading from "../../components/Loading";
import { useGetAllUsersQuery } from "../../redux/features/user/userApi";

const ManageUsers = () => {
  const { data: usersData, isLoading, isError } = useGetAllUsersQuery({});

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="Manage Users">
        <Loading />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout activeMenu="Manage Users">
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-red-500">Failed to load users.</p>
        </div>
      </DashboardLayout>
    );
  }

  const users = usersData?.users || [];

  return (
    <DashboardLayout activeMenu="Manage Users">
      <div className="mt-5 mb-10 w-full">
        <div className="mb-6">
          <h1 className="text-2xl text-slate-600 font-semibold">
            Manage <span className="text-slate-800 font-bold">Users</span>
          </h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
          <UsersTable usersData={users} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
