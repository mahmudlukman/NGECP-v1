import { assets } from "../utils/data";
import { useState } from "react";
import Modal from "./Modal";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../@types";

const MainBanner = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("signup");

  const handleCTA = () => {
    if (user) {
      // Navigate based on user role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "user") {
        navigate("/user/dashboard");
      } else {
        // fallback (e.g., unknown role)
        navigate("/");
      }
    } else {
      // If not logged in, open signup modal
      setCurrentPage("signup");
      setOpenAuthModal(true);
    }
  };

  return (
    <>
      <div className="mx-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              National Generator{" "}
              <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bg-[length:200%_200%] animate-text-shine">
                Emission Control Program
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              We promote sustainable energy practices, reduce harmful emissions,
              and ensure compliance with international environmental standards.
              Through innovative registration and monitoring systems, we aim to
              create a cleaner, greener Nigeria.
            </p>
            <button
              className="bg-primary text-sm font-semibold text-white px-8 py-3 rounded-lg hover:scale-103 active:scale-95 transition"
              onClick={handleCTA}
            >
              Get Started
            </button>
          </div>
          <div className="w-full md:w-1/2">
            <img
              src={assets.hero_img}
              alt="Hero Image"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("signup");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && (
            <Login
              setCurrentPage={setCurrentPage}
              closeModal={() => {
                setOpenAuthModal(false);
                setCurrentPage("signup");
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

export default MainBanner;
