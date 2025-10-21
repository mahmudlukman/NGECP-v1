import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import type { RootState } from "../@types";

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.role)) {
    let redirectPath = "/";

    if (user.role === "admin" || user.role === "editor") {
      redirectPath = "/admin/dashboard";
    } else if (user.role === "user") {
      redirectPath = "/user/my-generators-map-view";
    }

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
