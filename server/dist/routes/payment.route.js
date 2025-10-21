"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const payment_controller_1 = require("../controllers/payment.controller");
const paymentRouter = express_1.default.Router();
// User routes
paymentRouter.post("/initialize-payment", auth_1.isAuthenticated, payment_controller_1.initializePayment);
paymentRouter.get("/verify-payment", payment_controller_1.verifyPayment);
paymentRouter.get("/my-payments", auth_1.isAuthenticated, payment_controller_1.getMyPayments);
paymentRouter.get("/payment-reference/:reference", auth_1.isAuthenticated, payment_controller_1.getPaymentByReference);
paymentRouter.get("/payment-status/:inspectionId", auth_1.isAuthenticated, payment_controller_1.getPaymentStatus);
paymentRouter.post("/webhook", payment_controller_1.handleWebhook);
// Admin only routes
paymentRouter.get("/get-all-payments", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "editor"), payment_controller_1.getAllPayments);
paymentRouter.get("/payment-stats", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "editor"), payment_controller_1.getPaymentStatistics);
paymentRouter.put("/update-payment-status/id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "editor"), payment_controller_1.updatePaymentStatus);
paymentRouter.post("/refund-payment/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), payment_controller_1.initiateRefund);
exports.default = paymentRouter;
