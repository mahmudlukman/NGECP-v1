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
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F7F6F1] p-4 font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
      <PaymentContent
        isMounted={isMounted}
        isLoading={isLoading}
        status={status}
        tx_ref={tx_ref}
        transaction_id={transaction_id}
        data={data}
        error={error}
      />
    </div>
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
      <div className="flex min-h-[400px] flex-col items-center justify-center py-8">
        <div className="animate-pulse">
          <div className="mb-4 h-[300px] w-[300px] rounded bg-[#0B1F1A]/[0.06]" />
          <div className="mx-auto h-6 w-48 rounded bg-[#0B1F1A]/[0.06]" />
        </div>
        <p className="text-[#0B1F1A]/55">
          Initializing payment verification...
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center py-8">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#16785A]" />
        <h3 className="mb-2 font-[Newsreader,Georgia,serif] text-lg font-normal text-[#0B1F1A]">
          Verifying Payment...
        </h3>
        <p className="text-[#0B1F1A]/55">
          Please wait while we confirm your payment
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center py-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-2xl text-rose-600">
          ❌
        </div>
        <h3 className="mb-2 font-[Newsreader,Georgia,serif] text-lg font-normal text-rose-600">
          Payment Verification Failed
        </h3>
        <p className="text-[#0B1F1A]/55">
          {error?.data?.message || error?.message || "An error occurred"}
        </p>
      </div>
    );
  }

  // Success state
  if (data && data.success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Lottie options={defaultOptions} width={300} height={300} />
        <h5 className="mb-2 font-[Newsreader,Georgia,serif] text-xl font-normal text-[#0B1F1A]">
          Your order is successful 🎉
        </h5>
        {data.orderId && (
          <p className="mb-2 text-[#0B1F1A]/55">Order ID: {data.orderId}</p>
        )}
        {data.inspection && (
          <div className="text-sm text-[#0B1F1A]/65">
            <p>
              Total Amount:{" "}
              <span className="font-semibold text-[#16785A]">
                ₦{data.inspection.amount}
              </span>
            </p>
            <p>Status: {data.inspection.status}</p>
            {data.inspection.paidAt && (
              <p>
                Paid At: {new Date(data.inspection.paidAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
        <p className="mt-4 text-[#0B1F1A]/50">
          Redirecting to your generators...
        </p>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;
