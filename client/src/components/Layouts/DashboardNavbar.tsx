import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import AdminSidebar from "./DashboardSidebar";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ activeMenu }: { activeMenu: string }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2
        className="cursor-pointer relative text-4xl font-semibold text-slate-700"
        onClick={() => navigate("/")}
      >
        <span className="text-green-600">N</span>
        <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bg-[length:200%_200%] animate-text-shine">
          GECP
        </span>
        <span className="text-primary text-5xl leading-0">.</span>
      </h2>

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <AdminSidebar activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;
