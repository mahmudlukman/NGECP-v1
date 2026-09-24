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
      <div className="w-full max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Invalid Link</h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
          This password reset link is invalid or has expired. Please request a
          new link to reset your account.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors w-full"
        >
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto my-12 p-6 sm:p-8 bg-white border border-slate-100 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
          <KeyRound className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Reset Password
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
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
          <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="flex items-center gap-2 p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading || !!success}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Resetting Password...</span>
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
