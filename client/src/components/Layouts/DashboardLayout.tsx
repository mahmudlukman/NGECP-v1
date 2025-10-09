import type { ReactNode } from "react";
import type { RootState } from "../../@types";
import AdminNavbar from "./DashboardNavbar";
import SideMenu from "./DashboardSidebar";
import { useSelector } from "react-redux";

const DashboardLayout = ({
  children,
  activeMenu,
}: {
  children?: ReactNode;
  activeMenu: string;
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="">
      <AdminNavbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
