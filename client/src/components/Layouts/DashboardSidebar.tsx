import { useMemo } from "react";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../@types";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import { getInitials } from "../../utils/helper";

interface SideMenuProps {
  activeMenu: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: IconType;
  path: string;
}

const SideMenu = ({ activeMenu }: SideMenuProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();

  // Compute menu data directly based on user role instead of useEffect + useState
  const sideMenuData: MenuItem[] = useMemo(() => {
    if (!user) return [];
    return user.role === "admin" || user.role === "editor"
      ? SIDE_MENU_DATA
      : SIDE_MENU_USER_DATA;
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleClick = (route: string) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const initials = getInitials(
    user?.name,
    user?.accountType,
    user?.companyName,
  );

  const displayName =
    user?.accountType === "company" ? user?.companyName : user?.name;

  return (
    <aside className="w-64 h-[calc(100vh-61px)] bg-white border-r border-slate-200/80 sticky top-[61px] z-20 flex flex-col justify-between py-6 px-3 select-none">
      {/* Top Section: User Profile Card & Nav Items */}
      <div className="space-y-6">
        {/* User Card Header */}
        <div className="flex flex-col items-center text-center px-3 pb-5 border-b border-slate-100">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-xs mb-2">
            {initials || "U"}
          </div>

          <h4 className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">
            {displayName || "User Account"}
          </h4>

          <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">
            {user?.email || ""}
          </p>

          {(user?.role === "admin" || user?.role === "editor") && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mt-2">
              {user.role}
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {sideMenuData.map((item) => {
            const isActive = activeMenu === item.label;
            const isLogout = item.path === "logout";

            if (isLogout) return null; // Rendered separately at the bottom

            return (
              <button
                key={item.id || item.label}
                type="button"
                onClick={() => handleClick(item.path)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon
                  className={`text-lg shrink-0 ${
                    isActive ? "text-emerald-600" : "text-slate-400"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout Action */}
      <div className="pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          <span className="text-lg shrink-0">🚪</span>
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
};

export default SideMenu;
