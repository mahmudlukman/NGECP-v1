import type { ReactNode } from "react";
import type { RootState } from "../../@types";
import AdminNavbar from "./DashboardNavbar";
import SideMenu from "./DashboardSidebar";
import { useSelector } from "react-redux";

interface DashboardLayoutProps {
  children?: ReactNode;
  activeMenu: string;
}

const DashboardLayout = ({ children, activeMenu }: DashboardLayoutProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col antialiased">
      {/* Sticky Header Navbar */}
      <AdminNavbar activeMenu={activeMenu} />

      {/* Main Content & Sidebar Grid */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        {user && (
          <div className="hidden lg:block shrink-0">
            <SideMenu activeMenu={activeMenu} />
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
