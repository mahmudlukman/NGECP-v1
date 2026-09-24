import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from "lucide-react";

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout activeMenu="My Generators">
      <div className="flex flex-col items-center justify-center min-h-[500px] py-12 px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
          {/* Status Icon */}
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-rose-100">
            <XCircle className="w-9 h-9 stroke-[1.75]" />
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Payment Unsuccessful
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
            We couldn't process your transaction. This might be due to
            insufficient funds, an expired card, or temporary bank processing
            issues.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate("/user/checkout")}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Payment</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/user/my-generators")}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Generators</span>
            </button>
          </div>

          {/* Help link */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Need help?</span>
            <a
              href="mailto:support@example.com"
              className="font-medium text-emerald-600 hover:text-emerald-700 underline"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentFailure;
