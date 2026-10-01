"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const payment_controller_1 = require("../controllers/payment.controller");
const User_1 = require("../models/User");
const paymentRouter = express_1.default.Router();
// User routes
paymentRouter.post("/payment/initialize", auth_1.isAuthenticated, payment_controller_1.initializePayment);
paymentRouter.get("/payment/verify", payment_controller_1.verifyPayment);
paymentRouter.get("/payment/me", auth_1.isAuthenticated, payment_controller_1.myPayments);
paymentRouter.get("/payment/reference/:referenceId", auth_1.isAuthenticated, payment_controller_1.paymentByReference);
paymentRouter.get("/payment/status/:inspectionId", auth_1.isAuthenticated, payment_controller_1.paymentStatus);
paymentRouter.post("/webhook", payment_controller_1.handleWebhook);
// Admin only routes
paymentRouter.get("/payments", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)(User_1.UserRole.ADMIN, User_1.UserRole.EDITOR), payment_controller_1.allPayments);
paymentRouter.get("/payment/stats", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)(User_1.UserRole.ADMIN, User_1.UserRole.EDITOR), payment_controller_1.paymentStatistics);
paymentRouter.put("/payment/update/status/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)(User_1.UserRole.ADMIN, User_1.UserRole.EDITOR), payment_controller_1.updatePaymentStatus);
paymentRouter.post("/payment/refund/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)(User_1.UserRole.ADMIN), payment_controller_1.initiateRefund);
exports.default = paymentRouter;
