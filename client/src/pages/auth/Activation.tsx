import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useActivationMutation } from "../../redux/features/auth/authApi";
import type { ServerError } from "../../@types";
import Loading from "../../components/Loading";
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck } from "lucide-react";

const Activation = () => {
  const { activation_token } = useParams<{ activation_token: string }>();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activation, { isLoading, isSuccess, isError }] =
    useActivationMutation();

  // Guard to prevent double execution in React.StrictMode
  const hasExecutedRef = useRef(false);

  const onSubmit = useCallback(async () => {
    if (!activation_token) {
      toast.error("Missing activation token.");
      setErrorMessage("No activation token was provided in the request URL.");
      return;
    }

    try {
      const result = await activation({ activation_token }).unwrap();
      const successMsg = result?.message || "Account activated successfully!";
      toast.success(successMsg);

      // Auto redirect to login/home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const message =
        serverError.data?.message ||
        serverError.message ||
        "Activation failed. The link may have expired or is invalid.";

      setErrorMessage(message);
      toast.error(message);
    }
  }, [activation_token, activation, navigate]);

  useEffect(() => {
    if (!hasExecutedRef.current) {
      hasExecutedRef.current = true;
      onSubmit();
    }
  }, [onSubmit]);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-xs text-center transition-all">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loading />
            <h3 className="text-xl font-bold text-slate-900 mt-6">
              Activating your account
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Please wait while we verify your activation link...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Activation Failed
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              {errorMessage ||
                "The link may be invalid or expired. Please try requesting a new link or contact support."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors focus:outline-none"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Success State */}
        {isSuccess && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Account Activated!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Your email has been verified. You will be automatically redirected
              to log in shortly.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 focus:outline-none"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Initial Pending State */}
        {!isLoading && !isError && !isSuccess && (
          <div className="flex flex-col items-center justify-center py-6">
            <ShieldCheck className="w-8 h-8 text-slate-400 animate-pulse mb-3" />
            <p className="text-sm font-medium text-slate-600">
              Initializing verification...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activation;
