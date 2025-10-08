import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import type { RootState } from "../@types";

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/user/my-orders"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
