import { useState, useEffect } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import AdminSidebar from "./DashboardSidebar";
import { useNavigate } from "react-router-dom";

interface AdminNavbarProps {
  activeMenu: string;
}

const AdminNavbar = ({ activeMenu }: AdminNavbarProps) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const navigate = useNavigate();

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (openSideMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openSideMenu]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="flex items-center gap-4">
          {/* Mobile Drawer Toggle */}
          <button
            type="button"
            className="lg:hidden text-slate-700 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={() => setOpenSideMenu((prev) => !prev)}
            aria-label="Toggle Navigation Drawer"
          >
            {openSideMenu ? (
              <HiOutlineX className="text-2xl" />
            ) : (
              <HiOutlineMenu className="text-2xl" />
            )}
          </button>

          {/* Logo Branding */}
          <h2
            className="cursor-pointer font-bold text-2xl sm:text-3xl tracking-tight flex items-center"
            onClick={() => navigate("/")}
          >
            <span className="text-emerald-600 font-black">N</span>
            <span className="text-slate-900">GECP</span>
            <span className="text-emerald-500 font-extrabold text-3xl leading-none">
              .
            </span>
          </h2>
        </div>

        {/* Current Active Context Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{activeMenu}</span>
        </div>
      </header>

      {/* Mobile Drawer Overlay & Sidebar */}
      {openSideMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setOpenSideMenu(false)}
          />

          {/* Slide-out Container */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setOpenSideMenu(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <HiOutlineX className="text-xl" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AdminSidebar activeMenu={activeMenu} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
