import { apiSlice } from "../api/apiSlice";

interface InitializePaymentRequest {
  inspectionId: string;
  amount: number;
  redirect_url: string;
}

interface InitiatePaymentResponse {
  success: boolean;
  paymentUrl?: string;
  inspectionId: string;
  tx_ref?: string;
  message?: string;
}

interface VerifyPaymentRequest {
  status: string;
  tx_ref: string;
  transaction_id: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  orderId?: string;
  message?: string;
  inspection?: {
    _id: string;
    paymentId: string;
    amount: number;
    user: string;
    status: "pending_payment" | "paid" | "payment_failed" | "refunded";
    paymentInfo?: {
      id?: string;
      status?: string;
      type?: string;
    };
    paidAt?: string;
  };
}

interface PaymentStatusResponse {
  success: boolean;
  paymentStatus: string;
  orderStatus: string;
  paymentId?: string;
  paidAt?: string;
}

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initializePayment: builder.mutation<
      InitiatePaymentResponse,
      InitializePaymentRequest
    >({
      query: (body) => ({
        url: "initialize-payment",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Payment", id: "LIST" }],
    }),

    verifyPayment: builder.query<VerifyPaymentResponse, VerifyPaymentRequest>({
      query: ({ status, tx_ref, transaction_id }) => ({
        url: "verify-payment",
        method: "GET",
        params: {
          status,
          tx_ref,
          transaction_id,
        },
      }),
      providesTags: (result) => [
        { type: "Payment", id: result?.inspection?._id },
        { type: "Payment", id: "LIST" },
      ],
    }),

    getPaymentStatus: builder.query<PaymentStatusResponse, { paymentId: string }>(
      {
        query: ({ paymentId }) => ({
          url: `payment-status/${paymentId}`,
          method: "GET",
          credentials: "include",
        }),
        providesTags: (_result, _error, { paymentId }) => [
          { type: "Payment", id: paymentId },
        ],
      }
    ),

  }),
});

export const {
  useInitializePaymentMutation,
  useVerifyPaymentQuery,
  useGetPaymentStatusQuery,
} = paymentApi;
