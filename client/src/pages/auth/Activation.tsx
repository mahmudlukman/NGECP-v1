import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useActivationMutation } from "../../redux/features/auth/authApi";
import type { ServerError } from "../../@types";
import Loading from "../../components/Loading";

const Activation = () => {
  const { activation_token } = useParams<{ activation_token: string }>();
  const navigate = useNavigate();
  const [activation, { isLoading, isSuccess, isError }] =
    useActivationMutation();

  const onSubmit = useCallback(async () => {
    if (!activation_token) {
      toast.error("Missing token");
      return;
    }

    try {
      const result = await activation({ activation_token }).unwrap();
      toast.success(result.message || "Account activated successfully");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message || serverError.message || "Activation failed";
      toast.error(errorMessage);
    }
  }, [activation_token, activation]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <>
          <Loading />
          <p className="text-2xl sm:text-4xl font-semibold">
            Activating your account...
          </p>
        </>
      ) : isError ? (
        <p>Activation failed. Please try again or contact support.</p>
      ) : isSuccess ? (
        <>
          <p>Activation successful! You can now log in.</p>
          <button
            onClick={handleRedirect}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4fbf8b",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Go to Login
          </button>
        </>
      ) : (
        <p>Waiting for activation...</p>
      )}
    </div>
  );
};

export default Activation;
