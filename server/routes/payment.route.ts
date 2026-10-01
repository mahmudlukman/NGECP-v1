import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import {
  verifyPayment,
  paymentByReference,
  myPayments,
  allPayments,
  paymentStatistics,
  updatePaymentStatus,
  initiateRefund,
  initializePayment,
  paymentStatus,
  handleWebhook,
} from "../controllers/payment.controller";
import { UserRole } from "../models/User";

const paymentRouter = express.Router();

// User routes
paymentRouter.post("/payment/initialize", isAuthenticated, initializePayment);
paymentRouter.get("/payment/verify", verifyPayment);
paymentRouter.get("/payment/me", isAuthenticated, myPayments);
paymentRouter.get(
  "/payment/reference/:referenceId",
  isAuthenticated,
  paymentByReference,
);
paymentRouter.get(
  "/payment/status/:inspectionId",
  isAuthenticated,
  paymentStatus,
);

paymentRouter.post("/webhook", handleWebhook);

// Admin only routes
paymentRouter.get(
  "/payments",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  allPayments,
);

paymentRouter.get(
  "/payment/stats",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  paymentStatistics,
);

paymentRouter.put(
  "/payment/update/status/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  updatePaymentStatus,
);

paymentRouter.post(
  "/payment/refund/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN),
  initiateRefund,
);

export default paymentRouter;
