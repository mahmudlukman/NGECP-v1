import React, { useState, useEffect } from "react";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import { useForgotPasswordMutation } from "../../redux/features/auth/authApi";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Mail,
} from "lucide-react";

interface ForgotPasswordProps {
  setCurrentPage: (page: string) => void;
}

interface CustomFetchBaseQueryError {
  data?: {
    message?: string;
  };
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  // Auto clear error or success message after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);

    try {
      const res = await forgotPassword({ email }).unwrap();

      if (res?.message) {
        setSuccess(res.message);
      } else {
        setSuccess("Password reset link sent to your email!");
      }
    } catch (err: unknown) {
      const apiError = err as CustomFetchBaseQueryError;
      if (apiError.data?.message) {
        setError(apiError.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 flex flex-col justify-center bg-white rounded-xl">
      {/* Back Button Link */}
      <button
        type="button"
        onClick={() => setCurrentPage("login")}
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors w-fit mb-4 focus:outline-none"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Login</span>
      </button>

      {/* Header */}
      <div className="text-center sm:text-left mb-6">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3 sm:mx-0 mx-auto">
          <Mail className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Forgot Password?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          No worries, enter your email address below and we'll send you a
          password reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="email"
          autoComplete="email"
        />

        {/* Error Notification Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification Alert */}
        {success && (
          <div className="flex items-center gap-2 p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending Link...</span>
            </>
          ) : (
            "Send Reset Password Link"
          )}
        </button>

        {/* Return to Login */}
        <p className="text-xs text-center text-slate-600 pt-2">
          Remembered your password?{" "}
          <button
            type="button"
            className="font-semibold text-emerald-600 hover:text-emerald-700 underline focus:outline-none"
            onClick={() => setCurrentPage("login")}
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
