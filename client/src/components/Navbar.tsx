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
import type { RootState, ServerError } from "../@types";
import { getInitials } from "../utils/helper";

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
      await logout({}).unwrap();
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
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1 group focus:outline-none"
            >
              <div className="flex items-baseline font-black tracking-tight text-2xl sm:text-3xl text-slate-900">
                <span className="text-emerald-600">N</span>
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">
                  GECP
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5 inline-block" />
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6 text-sm font-medium">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `transition-colors duration-150 hover:text-emerald-600 ${
                        isActive
                          ? "text-emerald-600 font-semibold"
                          : "text-slate-600"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              {/* User Authentication Actions */}
              <div className="pl-6 border-l border-slate-200/80 flex items-center">
                {!user ? (
                  <button
                    onClick={() => {
                      setCurrentPage("login");
                      setOpenAuthModal(true);
                    }}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    Login
                  </button>
                ) : (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setOpenMenu((prev) => !prev)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none ring-2 ring-transparent focus:ring-emerald-500"
                      aria-expanded={openMenu}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-emerald-600/20">
                        {initials}
                      </div>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {openMenu && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                            Signed in as
                          </p>
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {user.name || user.companyName || "User"}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            if (
                              user?.role === "admin" ||
                              user?.role === "editor"
                            ) {
                              navigate("/admin/dashboard");
                            } else {
                              navigate("/user/my-generators-map-view");
                            }
                            setOpenMenu(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2 font-medium transition-colors"
                        >
                          <svg
                            className="w-4 h-4 text-slate-400"
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

                        <div className="my-1 border-t border-slate-100" />

                        <button
                          onClick={() => {
                            handleLogout();
                            setOpenMenu(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium transition-colors"
                        >
                          <svg
                            className="w-4 h-4 text-rose-500"
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
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {open ? (
                  <svg
                    className="w-6 h-6"
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
                  <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Sheet */}
        {open && (
          <div className="md:hidden bg-white border-b border-slate-200 shadow-xl px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-2 text-base font-medium transition-colors border-b border-slate-100 ${
                      isActive
                        ? "text-emerald-600 font-semibold"
                        : "text-slate-600"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {user && (
                <NavLink
                  to={
                    user.role === "admin" || user.role === "editor"
                      ? "/admin/dashboard"
                      : "/user/dashboard"
                  }
                  onClick={() => setOpen(false)}
                  className="py-2 text-base font-medium text-slate-600 border-b border-slate-100"
                >
                  Dashboard
                </NavLink>
              )}
            </div>

            <div className="pt-2">
              {!user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    setCurrentPage("login");
                    setOpenAuthModal(true);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 text-center transition-all"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-xl text-center transition-colors"
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
