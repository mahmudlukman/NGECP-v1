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

// Status badge palette, matching InspectionOverview and the Inspections tables:
// amber = pending, rose = cancelled/other, neutral grey = scheduled, mint = completed.
const statusBadgeClasses: Record<string, string> = {
  completed: "bg-[#16785A]/10 text-[#16785A]",
  scheduled: "bg-[#0B1F1A]/[0.06] text-[#0B1F1A]/70",
  pending: "bg-amber-100 text-amber-700",
};

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
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6F1]">
        <Loading fullScreen={false} />
      </div>
    );
  }

  if (isError || !inspection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6F1] p-4 font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
        <div className="w-full max-w-md rounded-2xl border border-[#0B1F1A]/10 bg-white p-8 text-center shadow-[0_30px_60px_-25px_rgba(11,31,26,0.25)]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h3 className="font-[Newsreader,Georgia,serif] text-xl font-normal text-[#0B1F1A]">
            Inspection Not Found
          </h3>
          <p className="mb-6 mt-2 text-xs text-[#0B1F1A]/55 sm:text-sm">
            We couldn't retrieve the requested receipt. The inspection record
            may have been deleted or doesn't exist.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full rounded-lg bg-[#0B1F1A] px-4 py-2.5 text-sm font-medium text-[#F3F1EA] transition-colors hover:bg-[#12332b]"
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
    <div className="min-h-screen bg-[#F7F6F1] px-4 py-8 font-[Figtree,ui-sans-serif,system-ui,sans-serif] print:bg-white print:p-0">
      <div className="mx-auto max-w-3xl">
        {/* Action Header (Hidden on Print) */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-[#0B1F1A]/60 transition-colors hover:text-[#0B1F1A] focus:outline-none"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={() => handlePrint()}
            className="flex items-center gap-2 rounded-lg bg-[#0B1F1A] px-4 py-2.5 text-sm font-medium text-[#F3F1EA] shadow-xs transition-all hover:bg-[#12332b] focus:outline-none"
          >
            <Download className="h-4 w-4" />
            <span>Download / Print Receipt</span>
          </button>
        </div>

        {/* Printable Receipt Container */}
        <div
          ref={receiptRef}
          className="rounded-2xl border border-[#0B1F1A]/10 bg-white p-8 shadow-xs sm:p-10 print:border-none print:p-0 print:shadow-none"
        >
          {/* Header */}
          <div className="mb-8 border-b border-[#0B1F1A]/10 pb-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-[#16785A]/25 bg-[#16785A]/[0.08] text-[#16785A] print:border-none">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="font-[Newsreader,Georgia,serif] text-2xl font-normal tracking-tight text-[#0B1F1A] sm:text-3xl">
              Payment Receipt
            </h1>
            <p className="mt-1 text-xs text-[#0B1F1A]/55 sm:text-sm">
              Official Inspection Payment Confirmation
            </p>
          </div>

          {/* Payment Meta Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 rounded-xl border border-[#0B1F1A]/10 bg-[#F7F6F1] p-5 sm:grid-cols-2 print:border-[#0B1F1A]/10 print:bg-[#F7F6F1]">
            {inspection.payment?.transactionReference && (
              <div className="border-b border-[#0B1F1A]/10 pb-3 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F1A]/40">
                  Transaction Reference
                </span>
                <p className="mt-0.5 break-all font-mono text-sm font-bold text-[#0B1F1A]">
                  {inspection.payment.transactionReference}
                </p>
              </div>
            )}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F1A]/40">
                Payment Date
              </span>
              <p className="mt-0.5 text-sm font-medium text-[#0B1F1A]/80">
                {inspection.payment?.paymentDate
                  ? format(
                      new Date(inspection.payment.paymentDate),
                      "dd MMMM yyyy, hh:mm a",
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F1A]/40">
                Payment Method
              </span>
              <p className="mt-0.5 text-sm font-medium capitalize text-[#0B1F1A]/80">
                {inspection.payment?.paymentMethod || "Online Payment"}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F1A]/40">
                Scheduled Date
              </span>
              <p className="mt-0.5 text-sm font-medium text-[#0B1F1A]/80">
                {inspection.scheduledDate
                  ? format(new Date(inspection.scheduledDate), "dd MMMM yyyy")
                  : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F1A]/40">
                Payment Status
              </span>
              <div className="mt-1">
                <span className="inline-flex items-center rounded-full bg-[#16785A]/10 px-2.5 py-0.5 text-xs font-semibold text-[#16785A]">
                  Paid
                </span>
              </div>
            </div>
          </div>

          {/* Owner & Generator Info */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Owner Section */}
            <div className="rounded-xl border border-[#0B1F1A]/10 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0B1F1A]">
                <User className="h-4 w-4 text-[#16785A]" />
                <h3>Owner Details</h3>
              </div>
              <div className="space-y-1.5 text-xs text-[#0B1F1A]/65">
                <p className="text-sm font-semibold text-[#0B1F1A]">
                  {displayOwnerName}
                </p>
                {displayOwnerEmail && <p>{displayOwnerEmail}</p>}
                {displayOwnerType && (
                  <p className="capitalize text-[#0B1F1A]/50">
                    Account Type:{" "}
                    <span className="font-medium text-[#0B1F1A]/75">
                      {displayOwnerType}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Generator Section */}
            <div className="rounded-xl border border-[#0B1F1A]/10 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0B1F1A]">
                <Zap className="h-4 w-4 text-[#16785A]" />
                <h3>Generator Details</h3>
              </div>
              <div className="space-y-1.5 text-xs text-[#0B1F1A]/65">
                <p>
                  <span className="font-medium text-[#0B1F1A]/45">ID:</span>{" "}
                  <span className="font-mono text-[#0B1F1A]/80">
                    {inspection.generator?.generatorId || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-[#0B1F1A]/45">
                    Brand / Model:
                  </span>{" "}
                  <span className="text-[#0B1F1A]/80">
                    {inspection.generator?.brand || "N/A"}{" "}
                    {inspection.generator?.model || ""}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-[#0B1F1A]/45">
                    Serial No:
                  </span>{" "}
                  <span className="font-mono text-[#0B1F1A]/80">
                    {inspection.generator?.serialNumber || "N/A"}
                  </span>
                </p>
                {inspection.generator?.capacity && (
                  <p>
                    <span className="font-medium text-[#0B1F1A]/45">
                      Capacity:
                    </span>{" "}
                    <span className="text-[#0B1F1A]/80">
                      {inspection.generator.capacity}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Details */}
          {inspection.location && (
            <div className="mb-8 rounded-xl border border-[#0B1F1A]/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0B1F1A]">
                <MapPin className="h-4 w-4 text-[#16785A]" />
                <h3>Inspection Site Location</h3>
              </div>
              <div className="space-y-1 text-xs text-[#0B1F1A]/65">
                <p>
                  <span className="font-medium text-[#0B1F1A]/45">
                    Address:
                  </span>{" "}
                  {inspection.location.address || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-[#0B1F1A]/45">
                    LGA / State:
                  </span>{" "}
                  {inspection.location.lga || "N/A"},{" "}
                  {inspection.location.state || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* Financial Summary */}
          <div className="mb-8 rounded-xl border border-[#0B1F1A]/10 bg-[#F7F6F1] p-5">
            <h3 className="mb-3 text-sm font-bold text-[#0B1F1A]">
              Payment Summary
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-[#0B1F1A]/60">
                <span>Inspection Processing Fee</span>
                <span className="font-medium text-[#0B1F1A]/80">
                  ₦{inspection.payment?.amount?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#0B1F1A]/10 pt-3 text-base font-bold text-[#0B1F1A]">
                <span>Total Amount Paid</span>
                <span className="text-[#16785A]">
                  ₦{inspection.payment?.amount?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-8 flex items-center justify-between rounded-xl border border-[#0B1F1A]/10 bg-[#F7F6F1] p-4">
            <span className="text-xs font-semibold text-[#0B1F1A]/65">
              Inspection Status
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                statusBadgeClasses[inspection.status] ||
                "bg-rose-100 text-rose-700"
              }`}
            >
              {inspection.status === "pending"
                ? "Pending Assignment"
                : inspection.status}
            </span>
          </div>

          {/* Card / Gateway Metadata */}
          {inspection.payment?.metadata && (
            <div className="mb-8 space-y-1 border-t border-[#0B1F1A]/10 pt-4 text-xs text-[#0B1F1A]/50">
              <div className="mb-1 flex items-center gap-1.5 font-bold text-[#0B1F1A]/75">
                <CreditCard className="h-3.5 w-3.5 text-[#0B1F1A]/40" />
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
          <div className="space-y-1 border-t border-[#0B1F1A]/10 pt-6 text-center text-xs text-[#0B1F1A]/40">
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
