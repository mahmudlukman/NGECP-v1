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
      <div className="flex justify-center items-center h-[95vh]">
        <p className="text-red-500">Failed to load orders.</p>
      </div>
    );
  }

  const users = usersData?.users || [];

  return (
    <DashboardLayout activeMenu="Manage Users">
      <div className="mt-5 mb-10">
        {isLoading && <p className="text-gray-500 mt-4">Loading users...</p>}

        {isError && <p className="text-red-500 mt-4">Error fetching users</p>}
      </div>

      <div className="md:col-span-2">
        <h1 className="text-2xl text-slate-500 mb-5">
          All <span className="text-slate-800 font-medium">Users</span>
        </h1>
        <div className="card">
          <div className="flex items-center justify-between"></div>
          <UsersTable usersData={users} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
