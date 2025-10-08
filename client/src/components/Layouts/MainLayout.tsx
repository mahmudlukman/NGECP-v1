import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const MainLayout = () => {
  const location = useLocation();

  // Check if current path starts with /admin or /user
  const isAdminPath = location.pathname.startsWith("/admin");
  const isUserPath = location.pathname.startsWith("/user");

  // Hide both on admin and user paths
  const hideLayout = isAdminPath || isUserPath;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-700">
      {!hideLayout && <Navbar />}

      <main className="flex-1 px-6 md:px-16 lg:px-24 xl:px-32">
        <Outlet />
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default MainLayout;
