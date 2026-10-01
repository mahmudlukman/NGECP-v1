import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface PrivateRouteProps {
  allowedRoles: string[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { user, isInitialized } = useSelector((state: RootState) => state.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-green-900" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin" || user.role === "editor") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "user") {
      return <Navigate to="/user/my-generators-map-view" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
