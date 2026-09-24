import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const MainLayout = () => {
  const location = useLocation();

  // Check if current path starts with /admin or /user
  const isAdminPath = location.pathname.startsWith("/admin");
  const isUserPath = location.pathname.startsWith("/user");

  // Hide Navbar/Footer on dashboard or panel routes
  const hideLayout = isAdminPath || isUserPath;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800 selection:bg-emerald-500 selection:text-white font-sans antialiased">
      {!hideLayout && <Navbar />}

      <main
        id="main-content"
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 transition-all"
      >
        <Outlet />
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default MainLayout;
