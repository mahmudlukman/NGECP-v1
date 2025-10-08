import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import {
  verifyPayment,
  getPaymentByReference,
  getMyPayments,
  getAllPayments,
  getPaymentStatistics,
  updatePaymentStatus,
  initiateRefund,
  initializePayment,
  getPaymentStatus,
  handleWebhook,
} from "../controllers/payment.controller";

const paymentRouter = express.Router();

// User routes
paymentRouter.post("/initialize-payment", isAuthenticated, initializePayment);
paymentRouter.get("/verify-payment", verifyPayment);
paymentRouter.get("/my-payments", isAuthenticated, getMyPayments);
paymentRouter.get("/payment-reference/:reference", isAuthenticated, getPaymentByReference);
paymentRouter.get("/payment-status/:inspectionId", isAuthenticated, getPaymentStatus);

paymentRouter.post("/webhook", handleWebhook);

// Admin only routes
paymentRouter.get(
  "/get-all-payments",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  getAllPayments
);

paymentRouter.get(
  "/payment-stats",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  getPaymentStatistics
);

paymentRouter.put(
  "/update-payment-status/id",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  updatePaymentStatus
);

paymentRouter.post(
  "/refund-payment/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  initiateRefund
);

export default paymentRouter;