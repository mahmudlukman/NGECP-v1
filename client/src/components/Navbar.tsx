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
    user?.companyName
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

  return (
    <>
      {/* ✅ Navbar */}
      <nav className="relative bg-white shadow-sm">
        <div className="mx-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
            {/* Logo */}
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className="relative text-4xl font-semibold text-slate-700"
            >
              <span className="text-green-600">N</span>
              <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bg-[length:200%_200%] animate-text-shine">
                GECP
              </span>
              <span className="text-primary text-5xl leading-0">.</span>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>

              {/* Auth / Profile */}
              {!user ? (
                <button
                  onClick={() => {
                    setCurrentPage("login");
                    setOpenAuthModal(true);
                  }}
                  className="px-8 py-2 bg-primary hover:scale-103 active:scale-95 transition text-white rounded-lg"
                >
                  Login
                </button>
              ) : (
                <div className="relative" ref={menuRef}>
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-semibold cursor-pointer"
                    onClick={() => setOpenMenu((prev) => !prev)}
                  >
                    {initials}
                  </div>
                  {openMenu && (
                    <ul className="absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-40 rounded-md text-sm z-40">
                      <li
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
                        className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                      >
                        Dashboard
                      </li>
                      <li
                        onClick={() => {
                          handleLogout();
                          setOpenMenu(false);
                        }}
                        className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                      >
                        Logout
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu + Login */}
            <div className="sm:hidden flex items-center gap-4">
              <button
                onClick={() => (open ? setOpen(false) : setOpen(true))}
                aria-label="Menu"
              >
                <img src={assets.menu_icon} alt="menu" />
              </button>
            </div>
          </div>
        </div>
        <hr className="border-gray-300" />

        {/* Mobile Dropdown */}
        {open && (
          <div className="absolute top-[64px] left-0 w-full bg-white shadow-md flex flex-col px-6 py-4 space-y-3 text-sm md:hidden z-50">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className="py-2 border-b border-gray-200"
            >
              Home
            </NavLink>
            {user && (
              <NavLink
                to={
                  user.role === "admin" || user.role === "editor"
                    ? "/admin/dashboard"
                    : "/user/dashboard"
                }
                onClick={() => setOpen(false)}
                className="py-2 border-b border-gray-200"
              >
                Dashboard
              </NavLink>
            )}

            <NavLink
              to="/about"
              onClick={() => setOpen(false)}
              className="py-2 border-b border-gray-200"
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className="py-2 border-b border-gray-200"
            >
              Contact
            </NavLink>

            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  setCurrentPage("login");
                  setOpenAuthModal(true);
                }}
                className="mt-3 px-6 py-2 bg-primary hover:scale-103 active:scale-95 transition text-white rounded-lg text-sm"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="mt-3 px-6 py-2 bg-primary hover:scale-103 active:scale-95 transition text-white rounded-full text-sm"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      {/* ✅ Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
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
