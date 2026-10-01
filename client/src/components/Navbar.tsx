import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../redux/features/auth/authApi";
import { assets } from "../utils/data";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import type { ServerError } from "../@types";
import { getInitials } from "../utils/helper";
import type { RootState } from "../redux/store";
import RoleBadge from "./RoleBadge";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [logout] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message || serverError.message || "Logout Failed";
      toast.error(errorMessage);
    }
  };

  const initials = getInitials(
    user?.name,
    user?.accountType,
    user?.companyName,
  );

  const isAdminUser = user?.role === "admin" || user?.role === "editor";
  const dashboardPath = isAdminUser
    ? "/admin/dashboard"
    : "/user/my-generators-map-view";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#0B1F1A]/10 bg-[#F7F6F1]/90 font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A] backdrop-blur-md transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Brand Logo */}
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-0.5 font-[Newsreader,Georgia,serif] text-2xl focus:outline-none sm:text-3xl"
            >
              <span className="text-[#16785A]">N</span>
              <span className="text-[#0B1F1A]">GECP</span>
              <span className="text-[#16785A]">.</span>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
              <div className="flex items-center gap-7 text-sm font-medium">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `relative py-1 transition-colors duration-150 hover:text-[#16785A] ${
                        isActive ? "text-[#16785A]" : "text-[#0B1F1A]/70"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.name}
                        {isActive && (
                          <span className="absolute -bottom-1 left-0 h-px w-full bg-[#16785A]" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* User Authentication Actions */}
              <div className="flex items-center border-l border-[#0B1F1A]/10 pl-6">
                {!user ? (
                  <button
                    onClick={() => {
                      setCurrentPage("login");
                      setOpenAuthModal(true);
                    }}
                    className="rounded-full bg-[#0B1F1A] px-6 py-2.5 text-sm font-semibold text-[#F3F1EA] shadow-[0_10px_25px_-12px_rgba(11,31,26,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#12332b]"
                  >
                    Login
                  </button>
                ) : (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setOpenMenu((prev) => !prev)}
                      className="flex items-center gap-2 rounded-full p-1 ring-2 ring-transparent transition-colors hover:bg-[#0B1F1A]/[0.04] focus:outline-none focus:ring-[#16785A]/40"
                      aria-expanded={openMenu}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1F1A] text-sm font-semibold text-[#F3F1EA] shadow-[0_10px_25px_-12px_rgba(11,31,26,0.5)]">
                        {initials}
                      </div>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {openMenu && (
                      <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 z-50 mt-3 w-56 rounded-2xl border border-[#0B1F1A]/10 bg-white py-2 shadow-[0_20px_50px_-20px_rgba(11,31,26,0.35)] duration-150">
                        <div className="mb-1 border-b border-[#0B1F1A]/10 px-4 py-2.5">
                          <p className="text-xs font-medium uppercase tracking-wider text-[#0B1F1A]/40">
                            Signed in as
                          </p>
                          <p className="truncate text-sm font-semibold text-[#0B1F1A]">
                            {user.name || user.companyName || "User"}
                          </p>
                          <div className="mt-1.5">
                            <RoleBadge role={user.role} />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            navigate(dashboardPath);
                            setOpenMenu(false);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-[#0B1F1A]/75 transition-colors hover:bg-[#16785A]/[0.06] hover:text-[#16785A]"
                        >
                          <svg
                            className="h-4 w-4 text-[#0B1F1A]/35"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          Dashboard
                        </button>

                        <div className="my-1 border-t border-[#0B1F1A]/10" />

                        <button
                          onClick={() => {
                            handleLogout();
                            setOpenMenu(false);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <svg
                            className="h-4 w-4 text-rose-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setOpen(!open)}
                className="rounded-xl p-2 text-[#0B1F1A]/70 transition-colors hover:bg-[#0B1F1A]/[0.05] hover:text-[#0B1F1A] focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {open ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <img src={assets.menu_icon} alt="menu" className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Sheet */}
        {open && (
          <div className="animate-in slide-in-from-top-4 space-y-4 border-b border-[#0B1F1A]/10 bg-[#F7F6F1] px-6 py-6 shadow-[0_20px_50px_-20px_rgba(11,31,26,0.25)] duration-200 md:hidden">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `border-b border-[#0B1F1A]/10 py-2 text-base font-medium transition-colors ${
                      isActive ? "text-[#16785A]" : "text-[#0B1F1A]/70"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {user && (
                <NavLink
                  to={dashboardPath}
                  onClick={() => setOpen(false)}
                  className="border-b border-[#0B1F1A]/10 py-2 text-base font-medium text-[#0B1F1A]/70"
                >
                  Dashboard
                </NavLink>
              )}
            </div>

            <div className="space-y-3 pt-2">
              {user && (
                <div className="flex items-center justify-between gap-3 px-1">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#0B1F1A]/40">
                      Signed in as
                    </p>
                    <p className="truncate text-sm font-semibold text-[#0B1F1A]">
                      {user.name || user.companyName || "User"}
                    </p>
                  </div>
                  <RoleBadge role={user.role} />
                </div>
              )}

              {!user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    setCurrentPage("login");
                    setOpenAuthModal(true);
                  }}
                  className="w-full rounded-xl bg-[#0B1F1A] py-3 text-center font-semibold text-[#F3F1EA] shadow-[0_10px_25px_-12px_rgba(11,31,26,0.5)] transition-all"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full rounded-xl bg-rose-50 py-3 text-center font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal Flow */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div className="p-2">
          {currentPage === "login" && (
            <Login
              setCurrentPage={setCurrentPage}
              closeModal={() => {
                setOpenAuthModal(false);
                setCurrentPage("login");
              }}
            />
          )}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "forgotPassword" && (
            <ForgotPassword setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
