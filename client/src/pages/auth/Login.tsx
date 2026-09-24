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
    <div className="w-full max-w-md p-6 sm:p-8 flex flex-col justify-center bg-white rounded-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Welcome Back
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
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
          <div className="flex justify-end mt-1.5">
            <button
              type="button"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors focus:outline-none"
              onClick={() => setCurrentPage("forgotPassword")}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* Footer Toggle */}
        <p className="text-xs text-center text-slate-600 pt-2">
          Don’t have an account?{" "}
          <button
            type="button"
            className="font-semibold text-emerald-600 hover:text-emerald-700 underline focus:outline-none"
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
