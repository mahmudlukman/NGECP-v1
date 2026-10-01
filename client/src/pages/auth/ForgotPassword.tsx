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
    <div className="flex w-full max-w-md flex-col justify-center rounded-xl bg-white p-6 font-[Figtree,ui-sans-serif,system-ui,sans-serif] sm:p-8">
      {/* Back Button Link */}
      <button
        type="button"
        onClick={() => setCurrentPage("login")}
        className="mb-4 inline-flex w-fit items-center gap-1 text-xs font-semibold text-[#0B1F1A]/50 transition-colors hover:text-[#0B1F1A] focus:outline-none"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Login</span>
      </button>

      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#16785A]/25 text-[#16785A] sm:mx-0">
          <Mail className="h-5 w-5" />
        </div>
        <h3 className="font-[Newsreader,Georgia,serif] text-xl font-normal tracking-tight text-[#0B1F1A]">
          Forgot Password?
        </h3>
        <p className="mt-1 text-xs text-[#0B1F1A]/55 sm:text-sm">
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
          <div className="animate-fade-in flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification Alert */}
        {success && (
          <div className="animate-fade-in flex items-center gap-2 rounded-lg border border-[#16785A]/25 bg-[#16785A]/[0.06] p-3 text-xs text-[#0B1F1A]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16785A]" />
            <span>{success}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1F1A] px-4 py-2.5 text-sm font-medium text-[#F3F1EA] shadow-xs transition-all hover:bg-[#12332b] focus:outline-none focus:ring-2 focus:ring-[#16785A]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending Link...</span>
            </>
          ) : (
            "Send Reset Password Link"
          )}
        </button>

        {/* Return to Login */}
        <p className="pt-2 text-center text-xs text-[#0B1F1A]/60">
          Remembered your password?{" "}
          <button
            type="button"
            className="font-semibold text-[#16785A] underline hover:text-[#0f5e44] focus:outline-none"
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
