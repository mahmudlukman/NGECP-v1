import type { FC } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "../assets/animations/107043-success.json";
import {
  useVerifyPaymentQuery,
  type VerifyPaymentResponse,
} from "../redux/features/payment/paymentApi";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  // Mount state for hydration safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Parse query params
  const params = new URLSearchParams(location.search);
  const status = params.get("status");
  const tx_ref = params.get("tx_ref");
  const transaction_id = params.get("transaction_id");

  const { data, error, isLoading } = useVerifyPaymentQuery(
    {
      status: status || "",
      tx_ref: tx_ref || "",
      transaction_id: transaction_id || "",
    },
    { skip: !status || !tx_ref || !transaction_id },
  );

  // Handle verification success → redirect after delay
  useEffect(() => {
    if (data && data.success) {
      const timer = setTimeout(() => {
        navigate("/user/generators");
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [data, navigate]);

  // Handle verification failure → redirect
  useEffect(() => {
    if (data && !data.success) {
      navigate("/payment/failure");
    }
  }, [data, navigate]);

  useEffect(() => {
    if (error) {
      navigate("/payment/failure");
    }
  }, [error, navigate]);

  return (
    <PaymentContent
      isMounted={isMounted}
      isLoading={isLoading}
      status={status}
      tx_ref={tx_ref}
      transaction_id={transaction_id}
      data={data}
      error={error}
    />
  );
};

interface PaymentContentProps {
  isMounted: boolean;
  isLoading: boolean;
  status: string | null;
  tx_ref: string | null;
  transaction_id: string | null;
  data?: VerifyPaymentResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

const PaymentContent: FC<PaymentContentProps> = ({
  isMounted,
  isLoading,
  status,
  tx_ref,
  transaction_id,
  data,
  error,
}) => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  // Initial mount/param validation
  if (!isMounted || !status || !tx_ref || !transaction_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
        <div className="animate-pulse">
          <div className="w-[300px] h-[300px] bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
        <p className="text-gray-600">Initializing payment verification...</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <h3 className="text-lg text-gray-700 mb-2">Verifying Payment...</h3>
        <p className="text-gray-500">
          Please wait while we confirm your payment
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
        <div className="text-red-500 text-4xl mb-4">❌</div>
        <h3 className="text-lg text-red-600 mb-2">
          Payment Verification Failed
        </h3>
        <p className="text-gray-500">
          {error?.data?.message || error?.message || "An error occurred"}
        </p>
      </div>
    );
  }

  // Success state
  if (data && data.success) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Lottie options={defaultOptions} width={300} height={300} />
        <h5 className="text-xl text-gray-700 mb-2">
          Your order is successful 🎉
        </h5>
        {data.orderId && (
          <p className="text-gray-500 mb-2">Order ID: {data.orderId}</p>
        )}
        {data.inspection && (
          <div className="text-gray-600 text-sm">
            <p>Total Amount: ₦{data.inspection.amount}</p>
            <p>Status: {data.inspection.status}</p>
            {data.inspection.paidAt && (
              <p>
                Paid At: {new Date(data.inspection.paidAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
        <p className="text-gray-500 mt-4">Redirecting to your generators...</p>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;
