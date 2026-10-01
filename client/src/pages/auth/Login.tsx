import React, { useState, useEffect } from "react";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";

interface LoginProps {
  setCurrentPage: (page: string) => void;
  closeModal: () => void;
}

interface CustomFetchBaseQueryError {
  data?: {
    message?: string;
  };
  status?: number;
}

const Login: React.FC<LoginProps> = ({ setCurrentPage, closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  // Auto clear error after 5s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle Login Form Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError(null);

    try {
      const response = await login({ email, password }).unwrap();
      closeModal();

      const role = response.user?.role;

      if (role === "admin" || role === "editor") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/my-generators-map-view");
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
      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="font-[Newsreader,Georgia,serif] text-xl font-normal tracking-tight text-[#0B1F1A]">
          Welcome Back
        </h3>
        <p className="mt-1 text-xs text-[#0B1F1A]/55 sm:text-sm">
          Please enter your details to log in
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Input */}
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="email"
        />

        {/* Password Input */}
        <div>
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="••••••••"
            type="password"
          />
          <div className="mt-1.5 flex justify-end">
            <button
              type="button"
              className="text-xs font-semibold text-[#16785A] transition-colors hover:text-[#0f5e44] focus:outline-none"
              onClick={() => setCurrentPage("forgotPassword")}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="animate-fade-in flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1F1A] px-4 py-2.5 text-sm font-medium text-[#F3F1EA] shadow-xs transition-all hover:bg-[#12332b] focus:outline-none focus:ring-2 focus:ring-[#16785A]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* Footer Toggle */}
        <p className="pt-2 text-center text-xs text-[#0B1F1A]/60">
          Don't have an account?{" "}
          <button
            type="button"
            className="font-semibold text-[#16785A] underline hover:text-[#0f5e44] focus:outline-none"
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
