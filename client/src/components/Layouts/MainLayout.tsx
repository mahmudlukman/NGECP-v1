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
    <div className="flex min-h-screen flex-col bg-[#F7F6F1] font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A] antialiased selection:bg-[#16785A] selection:text-white">
      {!hideLayout && <Navbar />}

      <main id="main-content" className="flex-1 w-full transition-all">
        <Outlet />
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default MainLayout;