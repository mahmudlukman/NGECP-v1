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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F7F6F1] p-4 font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#0B1F1A_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-[#0B1F1A]/10 bg-white p-8 text-center shadow-[0_30px_60px_-25px_rgba(11,31,26,0.25)] transition-all">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loading fullScreen={false} />
            <h3 className="mt-6 font-[Newsreader,Georgia,serif] text-xl font-normal text-[#0B1F1A]">
              Activating your account
            </h3>
            <p className="mt-2 text-sm text-[#0B1F1A]/55">
              Please wait while we verify your activation link...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <XCircle className="h-6 w-6" />
            </div>
            <h3 className="font-[Newsreader,Georgia,serif] text-xl font-normal text-[#0B1F1A]">
              Activation Failed
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#0B1F1A]/55 sm:text-sm">
              {errorMessage ||
                "The link may be invalid or expired. Please try requesting a new link or contact support."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 w-full rounded-lg bg-[#0B1F1A] px-4 py-2.5 text-sm font-medium text-[#F3F1EA] transition-colors hover:bg-[#12332b] focus:outline-none"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Success State */}
        {isSuccess && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#16785A]/25 text-[#16785A]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-[Newsreader,Georgia,serif] text-xl font-normal text-[#0B1F1A]">
              Account Activated!
            </h3>
            <p className="mt-2 text-xs text-[#0B1F1A]/55 sm:text-sm">
              Your email has been verified. You will be automatically redirected
              to log in shortly.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1F1A] px-4 py-2.5 text-sm font-medium text-[#F3F1EA] transition-all hover:bg-[#12332b] focus:outline-none"
            >
              <span>Go to Login</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Initial Pending State */}
        {!isLoading && !isError && !isSuccess && (
          <div className="flex flex-col items-center justify-center py-6">
            <ShieldCheck className="mb-3 h-8 w-8 animate-pulse text-[#0B1F1A]/35" />
            <p className="text-sm font-medium text-[#0B1F1A]/60">
              Initializing verification...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activation;
