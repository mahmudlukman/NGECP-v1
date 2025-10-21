import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetInspectionByIdQuery } from "../redux/features/inspection/inspectionApi";
import { format } from "date-fns";
import { Download, ArrowLeft } from "lucide-react";
import Loading from "../components/Loading";
import { useReactToPrint } from "react-to-print";

const InspectionReceipt = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useGetInspectionByIdQuery(id!, {
    skip: !id,
  });

  const inspection = data?.inspection;

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Inspection-Receipt-${inspection?._id}`,
  });

  const handleDownload = () => {
    if (handlePrint) {
      handlePrint();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (isError || !inspection) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Inspection not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const displayOwnerName = typeof inspection.owner === "string"
    ? inspection.owner
    : inspection.owner?.companyName || inspection.owner?.name || "N/A";

  const displayOwnerEmail = typeof inspection.owner === "string"
    ? ""
    : inspection.owner?.email || "";

  const displayOwnerType = typeof inspection.owner === "string"
    ? ""
    : inspection.owner?.accountType || "";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            <Download size={18} />
            Download Receipt
          </button>
        </div>

        {/* Receipt */}
        <div
          ref={receiptRef}
          className="bg-white rounded-lg shadow-lg p-8 print:shadow-none"
        >
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-primary">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              ✓
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Inspection Payment Receipt
            </h1>
            <p className="text-slate-500">Thank you for your payment!</p>
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-6 rounded-lg">
            {inspection.payment?.transactionReference && (
              <div className="col-span-2">
                <p className="text-sm text-slate-500 mb-1">Transaction Reference</p>
                <p className="font-semibold text-slate-800 break-all">
                  {inspection.payment.transactionReference}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-500 mb-1">Payment Date</p>
              <p className="font-semibold text-slate-800">
                {inspection.payment?.paymentDate
                  ? format(new Date(inspection.payment.paymentDate), "dd MMMM yyyy, hh:mm a")
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Payment Method</p>
              <p className="font-semibold text-slate-800 capitalize">
                {inspection.payment?.paymentMethod || "Online Payment"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Payment Status</p>
              <span className="inline-block px-3 py-1 text-xs rounded-full font-semibold bg-green-100 text-green-700">
                Paid
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Scheduled Date</p>
              <p className="font-semibold text-slate-800">
                {inspection.scheduledDate
                  ? format(new Date(inspection.scheduledDate), "dd MMMM yyyy")
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Owner & Generator Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:grid-cols-2 print:gap-4">
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Owner Details</h3>
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-medium text-slate-800">{displayOwnerName}</p>
                {displayOwnerEmail && <p>{displayOwnerEmail}</p>}
                {displayOwnerType && (
                  <p className="capitalize">
                    <span className="font-semibold">Account Type:</span> {displayOwnerType}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Generator Details</h3>
              <div className="text-sm text-slate-600 space-y-1">
                <p>
                  <span className="font-semibold">Generator ID:</span>{" "}
                  {inspection.generator?.generatorId || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Brand:</span>{" "}
                  {inspection.generator?.brand || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Model:</span>{" "}
                  {inspection.generator?.model || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Serial Number:</span>{" "}
                  {inspection.generator?.serialNumber || "N/A"}
                </p>
                {inspection.generator?.capacity && (
                  <p>
                    <span className="font-semibold">Capacity:</span>{" "}
                    {inspection.generator.capacity}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Info */}
          {inspection.location && (
            <div className="mb-8 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-3">Inspection Location</h3>
              <div className="text-sm text-slate-600 space-y-1">
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {inspection.location.address || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">City/LGA:</span>{" "}
                  {inspection.location.lga || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">State:</span>{" "}
                  {inspection.location.state || "N/A"}
                </p>
                {inspection.location.coordinates && (
                  <p>
                    <span className="font-semibold">Coordinates:</span>{" "}
                    {inspection.location.coordinates.latitude},{" "}
                    {inspection.location.coordinates.longitude}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-slate-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-slate-800 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Inspection Fee</span>
                <span className="font-medium text-slate-800">
                  ₦{inspection.payment?.amount?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="pt-3 border-t-2 border-slate-300">
                <div className="flex justify-between text-lg font-bold text-slate-800">
                  <span>Total Amount Paid</span>
                  <span className="text-primary">
                    ₦{inspection.payment?.amount?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inspection Status */}
          <div className="p-4 bg-blue-50 border-l-4 border-primary rounded mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Inspection Status:</span>
              <span
                className={`px-3 py-1 text-sm rounded-full font-semibold ${
                  inspection.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : inspection.status === "scheduled"
                    ? "bg-blue-100 text-blue-700"
                    : inspection.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {inspection.status === "pending" && "Pending Assignment"}
                {inspection.status === "scheduled" && "Scheduled"}
                {inspection.status === "completed" && "Completed"}
                {inspection.status === "cancelled" && "Cancelled"}
              </span>
            </div>
          </div>

          {/* Payment Metadata */}
          {inspection.payment?.metadata && (
            <div className="mb-8 text-xs text-slate-500">
              <h4 className="font-semibold text-slate-700 mb-2">Transaction Details</h4>
              {inspection.payment.metadata.flutterwaveTransactionId && (
                <p>
                  <span className="font-semibold">Transaction ID:</span>{" "}
                  {inspection.payment.metadata.flutterwaveTransactionId}
                </p>
              )}
              {inspection.payment.metadata.cardType && (
                <p>
                  <span className="font-semibold">Card Type:</span>{" "}
                  {inspection.payment.metadata.cardType}
                </p>
              )}
              {inspection.payment.metadata.cardLast4 && (
                <p>
                  <span className="font-semibold">Card:</span> **** {inspection.payment.metadata.cardLast4}
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            <p className="mb-2">
              This receipt confirms your payment for generator inspection services. An inspector will be assigned shortly.
            </p>
            <p className="mb-2">
              For any inquiries, please contact our support team with your transaction reference.
            </p>
            <p className="text-xs">
              © {new Date().getFullYear()} National Generator Emission
          Control Program. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionReceipt;