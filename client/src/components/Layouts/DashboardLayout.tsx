import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import {
  SIDE_MENU_DATA,
  type SideMenuItem,
  type UserRole,
} from "../../utils/data";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import type { ServerError } from "../../@types";
import toast from "react-hot-toast";
import RoleBadge from "../RoleBadge";

interface SideMenuProps {
  children?: React.ReactNode;
}

interface NavigationItemProps {
  item: SideMenuItem;
  isActive: boolean;
  onClick: (path: string) => void;
  isCollapsed: boolean;
}

const NavigationItem = ({
  item,
  isActive,
  onClick,
  isCollapsed,
}: NavigationItemProps) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onClick(item.path)}
      className={`group flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-[#16785A]/10 text-[#0B1F1A] shadow-xs"
          : "text-[#0B1F1A]/65 hover:bg-[#0B1F1A]/[0.04] hover:text-[#0B1F1A]"
      }`}
    >
      <Icon
        className={`h-5 w-5 flex-shrink-0 ${
          isActive ? "text-[#16785A]" : "text-[#0B1F1A]/40"
        }`}
      />

      {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
    </button>
  );
};

const DashboardLayout = ({ children }: SideMenuProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sidebarCollapsed = false;
  const isAdminUser = user?.role === "admin" || user?.role === "editor";

  const displayName =
    user?.accountType === "company"
      ? user?.companyName || "Company"
      : user?.name || "User";

  const visibleMenuItems: SideMenuItem[] = SIDE_MENU_DATA.filter((item) =>
    user?.role ? item.visible.includes(user.role as UserRole) : false,
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;

      setIsMobile(mobile);

      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleNavigation = (path: string) => {
    navigate(path);

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const isMenuItemActive = (itemPath: string) => {
    return (
      location.pathname === itemPath ||
      location.pathname.startsWith(`${itemPath}/`)
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      setProfileDropdownOpen(false);
      setSidebarOpen(false);

      navigate("/");
    } catch (err: unknown) {
      const serverError = err as ServerError;

      toast.error(
        serverError?.data?.message ||
          serverError?.message ||
          "Failed to logout.",
      );
    }
  };

  const dashboardPath = isAdminUser
    ? "/admin/dashboard"
    : "/user/my-generators-map-view";

  const profilePath = user?.role === "user" ? "/user/profile" : null;

  return (
    <div className="flex h-screen bg-[#F7F6F1] font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A]">
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } ${
          sidebarCollapsed ? "w-16" : "w-64"
        } border-r border-[#0B1F1A]/10 bg-white`}
      >
        <div className="flex h-16 items-center border-b border-[#0B1F1A]/10 px-6">
          <Link
            className="flex cursor-pointer items-center space-x-3"
            to={dashboardPath}
            onClick={() => {
              if (isMobile) {
                setSidebarOpen(false);
              }
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B1F1A] shadow-xs">
              <Briefcase className="h-5 w-5 text-[#7FD1AE]" />
            </div>

            {!sidebarCollapsed && (
              <span className="font-[Newsreader,Georgia,serif] text-xl tracking-tight text-[#0B1F1A]">
                NGECP
              </span>
            )}
          </Link>
        </div>
        <nav className="space-y-2 p-4">
          {visibleMenuItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={isMenuItemActive(item.path)}
              onClick={handleNavigation}
              isCollapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        {/* Signed-in role (sidebar) */}
        {!sidebarCollapsed && user?.role && (
          <div className="absolute bottom-16 left-4 right-4 px-3">
            <p className="mb-1 text-[11px] text-[#0B1F1A]/45">Signed in as</p>
            <RoleBadge role={user.role} />
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-5 w-5 flex-shrink-0 text-rose-500" />

            {!sidebarCollapsed && (
              <span className="ml-3">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            )}
          </button>
        </div>
      </div>

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0B1F1A]/20 backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#0B1F1A]/10 bg-white/80 px-6 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                type="button"
                className="cursor-pointer rounded-xl p-2 text-[#0B1F1A]/70 transition-colors duration-200 hover:bg-[#0B1F1A]/[0.04]"
                onClick={toggleSidebar}
                aria-label={
                  sidebarOpen ? "Close navigation" : "Open navigation"
                }
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5 text-[#0B1F1A]/70" />
                ) : (
                  <Menu className="h-5 w-5 text-[#0B1F1A]/70" />
                )}
              </button>
            )}

            <div>
              <h1 className="text-base font-semibold text-[#0B1F1A]">
                Welcome back,{" "}
                {user?.accountType === "company"
                  ? user?.companyName || "User"
                  : user?.name || "User"}
                !
              </h1>

              <p className="hidden text-xs text-[#0B1F1A]/50 sm:block">
                Here's your invoice and compliance overview.
              </p>
            </div>
          </div>

          <div className="relative flex items-center space-x-3">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#0B1F1A]/[0.04]"
              onClick={(event) => {
                event.stopPropagation();
                setProfileDropdownOpen((prev) => !prev);
              }}
              aria-expanded={profileDropdownOpen}
              aria-label="Open profile menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1F1A] text-xs font-bold text-[#F3F1EA] shadow-xs">
                {(user?.accountType === "company"
                  ? user?.companyName
                  : user?.name
                )
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              <div className="hidden text-left sm:block">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#0B1F1A]">
                    {displayName}
                  </p>
                  <RoleBadge role={user?.role} />
                </div>

                <p className="text-xs text-[#0B1F1A]/50">{user?.email || ""}</p>
              </div>
            </button>

            {profileDropdownOpen && (
              <div
                className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-[#0B1F1A]/10 bg-white py-2 shadow-[0_20px_50px_-20px_rgba(11,31,26,0.35)]"
                onClick={(event) => event.stopPropagation()}
              >
                {/* Dropdown header (visible on mobile too) */}
                <div className="mb-1 border-b border-[#0B1F1A]/10 px-4 py-2.5">
                  <p className="truncate text-sm font-medium text-[#0B1F1A]">
                    {displayName}
                  </p>
                  <p className="mb-1.5 truncate text-xs text-[#0B1F1A]/50">
                    {user?.email || ""}
                  </p>
                  <RoleBadge role={user?.role} />
                </div>

                {profilePath && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate(profilePath);
                    }}
                    className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-[#0B1F1A]/80 hover:bg-[#16785A]/[0.06] hover:text-[#16785A]"
                  >
                    My Profile
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate(dashboardPath);
                  }}
                  className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-[#0B1F1A]/80 hover:bg-[#16785A]/[0.06] hover:text-[#16785A]"
                >
                  Dashboard
                </button>

                <div className="my-1 border-t border-[#0B1F1A]/10" />

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
