import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { useResetPasswordMutation } from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  ShieldAlert,
} from "lucide-react";

interface CustomFetchBaseQueryError {
  data?: {
    message?: string;
  };
}

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const userId = searchParams.get("id");

  const isInvalidLink = !token || !userId;

  useEffect(() => {
    if (isInvalidLink) {
      toast.error("Invalid or expired reset password link!");
    }
  }, [isInvalidLink]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !userId) {
      setError("Invalid or missing password reset parameters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);

    try {
      const res = await resetPassword({
        userId,
        token,
        newPassword: password,
      }).unwrap();

      const successMsg =
        res?.message || "Password reset successful! Redirecting...";
      setSuccess(successMsg);
      toast.success("Password updated successfully!");

      // Redirect after short delay
      setTimeout(() => navigate("/"), 2500);
    } catch (err: unknown) {
      const apiError = err as CustomFetchBaseQueryError;
      if (apiError.data?.message) {
        setError(apiError.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  // Render state if reset parameters are missing from URL
  if (isInvalidLink) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F7F6F1] p-4 font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#0B1F1A_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        />
        <div className="relative w-full max-w-md rounded-2xl border border-[#0B1F1A]/10 bg-white p-8 text-center shadow-[0_30px_60px_-25px_rgba(11,31,26,0.25)]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h3 className="font-[Newsreader,Georgia,serif] text-lg font-normal text-[#0B1F1A]">
            Invalid Link
          </h3>
          <p className="mb-6 mt-2 text-xs leading-relaxed text-[#0B1F1A]/60 sm:text-sm">
            This password reset link is invalid or has expired. Please request a
            new link to reset your account.
          </p>
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center rounded-lg bg-[#0B1F1A] px-4 py-2.5 text-sm font-medium text-[#F3F1EA] transition-colors hover:bg-[#12332b]"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F7F6F1] p-4 font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#0B1F1A_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 shadow-[0_30px_60px_-25px_rgba(11,31,26,0.25)] sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#16785A]/25 text-[#16785A]">
            <KeyRound className="h-5 w-5" />
          </div>
          <h3 className="font-[Newsreader,Georgia,serif] text-xl font-normal tracking-tight text-[#0B1F1A]">
            Reset Password
          </h3>
          <p className="mt-1 text-xs text-[#0B1F1A]/55 sm:text-sm">
            Please enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="New Password"
            placeholder="Min 8 Characters"
            type="password"
            autoComplete="new-password"
          />

          {/* Confirm Password */}
          <Input
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
            label="Confirm Password"
            placeholder="Re-enter your password"
            type="password"
            autoComplete="new-password"
          />

          {/* Error Alert */}
          {error && (
            <div className="animate-fade-in flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="animate-fade-in flex items-center gap-2 rounded-lg border border-[#16785A]/25 bg-[#16785A]/[0.06] p-3 text-xs text-[#0B1F1A]">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16785A]" />
              <span>{success}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading || !!success}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1F1A] px-4 py-2.5 text-sm font-medium text-[#F3F1EA] shadow-xs transition-all hover:bg-[#12332b] focus:outline-none focus:ring-2 focus:ring-[#16785A]/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Resetting Password...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
