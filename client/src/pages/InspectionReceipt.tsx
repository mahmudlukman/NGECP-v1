import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetInspectionByIdQuery } from "../redux/features/inspection/inspectionApi";
import { format } from "date-fns";
import {
  Download,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  MapPin,
  User,
  Zap,
  CreditCard,
} from "lucide-react";
import Loading from "../components/Loading";
import { useReactToPrint } from "react-to-print";

const InspectionReceipt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useGetInspectionByIdQuery(id!, {
    skip: !id,
  });

  const inspection = data?.inspection;

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Inspection-Receipt-${inspection?._id || "download"}`,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loading />
      </div>
    );
  }

  if (isError || !inspection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-xs text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Inspection Not Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6">
            We couldn't retrieve the requested receipt. The inspection record
            may have been deleted or doesn't exist.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Safe Owner details resolution
  const displayOwnerName =
    typeof inspection.owner === "string"
      ? inspection.owner
      : inspection.owner?.companyName || inspection.owner?.name || "N/A";

  const displayOwnerEmail =
    typeof inspection.owner === "string" ? "" : inspection.owner?.email || "";

  const displayOwnerType =
    typeof inspection.owner === "string"
      ? ""
      : inspection.owner?.accountType || "";

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto">
        {/* Action Header (Hidden on Print) */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={() => handlePrint()}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-xs transition-all focus:outline-none"
          >
            <Download className="w-4 h-4" />
            <span>Download / Print Receipt</span>
          </button>
        </div>

        {/* Printable Receipt Container */}
        <div
          ref={receiptRef}
          className="bg-white border border-slate-200 rounded-2xl shadow-xs p-8 sm:p-10 print:shadow-none print:border-none print:p-0"
        >
          {/* Header */}
          <div className="text-center pb-8 mb-8 border-b border-slate-200">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100 print:border-none">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Payment Receipt
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Official Inspection Payment Confirmation
            </p>
          </div>

          {/* Payment Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200/60 mb-8 print:bg-slate-50 print:border-slate-200">
            {inspection.payment?.transactionReference && (
              <div className="sm:col-span-2 pb-3 border-b border-slate-200/60">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Transaction Reference
                </span>
                <p className="text-sm font-mono font-bold text-slate-900 break-all mt-0.5">
                  {inspection.payment.transactionReference}
                </p>
              </div>
            )}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Payment Date
              </span>
              <p className="text-sm font-medium text-slate-800 mt-0.5">
                {inspection.payment?.paymentDate
                  ? format(
                      new Date(inspection.payment.paymentDate),
                      "dd MMMM yyyy, hh:mm a",
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Payment Method
              </span>
              <p className="text-sm font-medium text-slate-800 capitalize mt-0.5">
                {inspection.payment?.paymentMethod || "Online Payment"}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Scheduled Date
              </span>
              <p className="text-sm font-medium text-slate-800 mt-0.5">
                {inspection.scheduledDate
                  ? format(new Date(inspection.scheduledDate), "dd MMMM yyyy")
                  : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Payment Status
              </span>
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Paid
                </span>
              </div>
            </div>
          </div>

          {/* Owner & Generator Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Owner Section */}
            <div className="p-4 border border-slate-200/80 rounded-xl">
              <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
                <User className="w-4 h-4 text-emerald-600" />
                <h3>Owner Details</h3>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600">
                <p className="font-semibold text-slate-800 text-sm">
                  {displayOwnerName}
                </p>
                {displayOwnerEmail && <p>{displayOwnerEmail}</p>}
                {displayOwnerType && (
                  <p className="capitalize text-slate-500">
                    Account Type:{" "}
                    <span className="font-medium text-slate-700">
                      {displayOwnerType}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Generator Section */}
            <div className="p-4 border border-slate-200/80 rounded-xl">
              <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
                <Zap className="w-4 h-4 text-emerald-600" />
                <h3>Generator Details</h3>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600">
                <p>
                  <span className="font-medium text-slate-500">ID:</span>{" "}
                  <span className="font-mono text-slate-800">
                    {inspection.generator?.generatorId || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-slate-500">
                    Brand / Model:
                  </span>{" "}
                  <span className="text-slate-800">
                    {inspection.generator?.brand || "N/A"}{" "}
                    {inspection.generator?.model || ""}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-slate-500">Serial No:</span>{" "}
                  <span className="font-mono text-slate-800">
                    {inspection.generator?.serialNumber || "N/A"}
                  </span>
                </p>
                {inspection.generator?.capacity && (
                  <p>
                    <span className="font-medium text-slate-500">
                      Capacity:
                    </span>{" "}
                    <span className="text-slate-800">
                      {inspection.generator.capacity}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Details */}
          {inspection.location && (
            <div className="mb-8 p-4 border border-slate-200/80 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-sm">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3>Inspection Site Location</h3>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <span className="font-medium text-slate-500">Address:</span>{" "}
                  {inspection.location.address || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-slate-500">
                    LGA / State:
                  </span>{" "}
                  {inspection.location.lga || "N/A"},{" "}
                  {inspection.location.state || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* Financial Summary */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 mb-8">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Payment Summary
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Inspection Processing Fee</span>
                <span className="font-medium text-slate-800">
                  ₦{inspection.payment?.amount?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                <span>Total Amount Paid</span>
                <span className="text-emerald-600">
                  ₦{inspection.payment?.amount?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-xl mb-8">
            <span className="text-xs font-semibold text-slate-600">
              Inspection Status
            </span>
            <span
              className={`px-3 py-1 text-xs rounded-full font-semibold capitalize ${
                inspection.status === "completed"
                  ? "bg-emerald-100 text-emerald-800"
                  : inspection.status === "scheduled"
                    ? "bg-blue-100 text-blue-800"
                    : inspection.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
              }`}
            >
              {inspection.status === "pending"
                ? "Pending Assignment"
                : inspection.status}
            </span>
          </div>

          {/* Card / Gateway Metadata */}
          {inspection.payment?.metadata && (
            <div className="mb-8 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>Gateway Payment Info</span>
              </div>
              {inspection.payment.metadata.flutterwaveTransactionId && (
                <p>
                  Gateway Ref ID:{" "}
                  {inspection.payment.metadata.flutterwaveTransactionId}
                </p>
              )}
              {inspection.payment.metadata.cardLast4 && (
                <p>
                  Card: {inspection.payment.metadata.cardType || "Card"} ending
                  in **** {inspection.payment.metadata.cardLast4}
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400 space-y-1">
            <p>
              This is a computer-generated document confirming inspection fee
              payment.
            </p>
            <p>
              © {new Date().getFullYear()} National Generator Emission Control
              Program. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionReceipt;
