"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.initiateRefund = exports.updatePaymentStatus = exports.getPaymentStatistics = exports.getAllPayments = exports.getMyPayments = exports.getPaymentStatus = exports.getPaymentByReference = exports.verifyPayment = exports.initializePayment = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const Payment_1 = require("../models/Payment");
const Inspection_1 = require("../models/Inspection");
const Generator_1 = require("../models/Generator");
const User_1 = require("../models/User");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const uuid_1 = require("uuid");
const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(config_1.default.FLW_PUBLIC_KEY, config_1.default.FLW_SECRET_KEY);
// Initialize payment (called after scheduling inspection)
exports.initializePayment = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { inspectionId, amount, redirect_url } = req.body;
        const userId = req.user?._id;
        if (!inspectionId || !amount || !redirect_url) {
            return next(new errorHandler_1.default("Missing required fields: inspectionId, amount, redirect_url", 400));
        }
        // Verify inspection exists and belongs to user
        const inspection = await Inspection_1.Inspection.findById(inspectionId)
            .populate("generator", "generatorId brand model serialNumber")
            .populate("owner", "name email companyName accountType");
        if (!inspection) {
            return next(new errorHandler_1.default("Inspection not found", 404));
        }
        if (inspection.owner._id.toString() !== userId?.toString()) {
            return next(new errorHandler_1.default("You don't have permission to pay for this inspection", 403));
        }
        // Check if payment already exists
        const existingPayment = await Payment_1.Payment.findOne({
            inspection: inspectionId,
        });
        let payment;
        let tx_ref;
        if (existingPayment) {
            // If payment exists and is already paid, return error
            if (existingPayment.status === "paid") {
                return next(new errorHandler_1.default("Payment already completed for this inspection", 400));
            }
            // Reuse existing payment record
            payment = existingPayment;
            tx_ref = payment.transactionReference;
        }
        else {
            // Create new payment record
            tx_ref = `GEN-INS-${(0, uuid_1.v4)()}`;
            payment = await Payment_1.Payment.create({
                user: userId,
                inspection: inspectionId,
                amount,
                transactionReference: tx_ref,
                status: "pending",
            });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        // Get generator info for payment description
        const generator = inspection.generator;
        const displayName = user.accountType === "individual" ? user.name : user.companyName;
        // Prepare Flutterwave payment data
        const paymentData = {
            tx_ref,
            amount,
            currency: "NGN",
            redirect_url,
            customer: {
                email: user.email,
                name: displayName || user.email,
                phone_number: user.phoneNumber || "",
            },
            customizations: {
                title: "Generator Inspection Payment",
                description: `Payment for inspection of ${generator.brand} ${generator.model} - ${generator.generatorId}`,
                // logo: config.COMPANY_LOGO_URL || "",
            },
            meta: {
                inspectionId,
                userId: userId.toString(),
                generatorId: generator._id.toString(),
                generatorSerialNumber: generator.serialNumber,
            },
            payment_options: "card,banktransfer,ussd,account",
        };
        // Initialize payment with Flutterwave
        const response = await axios_1.default.post("https://api.flutterwave.com/v3/payments", paymentData, {
            headers: {
                Authorization: `Bearer ${config_1.default.FLW_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });
        if (response.data?.status === "success") {
            // Update payment record with Flutterwave data
            payment.metadata = {
                flutterwavePaymentLink: response.data.data.link,
                flutterwavePaymentId: response.data.data.id,
                initiatedAt: new Date(),
            };
            await payment.save();
            res.status(200).json({
                success: true,
                message: "Payment initialized successfully",
                paymentUrl: response.data.data.link,
                paymentReference: tx_ref,
                inspectionId,
                amount,
            });
        }
        else {
            return next(new errorHandler_1.default("Payment initialization failed", 400));
        }
    }
    catch (error) {
        // Handle Flutterwave API errors
        if (error.response?.data) {
            return next(new errorHandler_1.default(error.response.data.message || "Payment initialization failed", 400));
        }
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Verify payment (callback from Flutterwave)
exports.verifyPayment = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { status, tx_ref, transaction_id } = req.query;
        if (!status || !tx_ref || !transaction_id) {
            return next(new errorHandler_1.default("Missing required query parameters", 400));
        }
        // Find payment record
        const payment = await Payment_1.Payment.findOne({
            transactionReference: tx_ref,
        }).populate("inspection");
        if (!payment) {
            return next(new errorHandler_1.default("Payment record not found", 404));
        }
        // If payment already verified, return success
        if (payment.status === "paid") {
            return res.status(200).json({
                success: true,
                message: "Payment already verified",
                payment,
            });
        }
        // If status is not successful, mark as failed
        if (status !== "successful") {
            payment.status = Payment_1.PaymentStatus.FAILED;
            payment.metadata = {
                ...payment.metadata,
                failureReason: "Payment not completed",
                failedAt: new Date(),
            };
            await payment.save();
            return res.status(400).json({
                success: false,
                message: "Payment was not successful",
            });
        }
        // Verify transaction with Flutterwave
        const response = await flw.Transaction.verify({
            id: transaction_id,
        });
        if (response.data.status === "successful" &&
            response.data.amount >= payment.amount &&
            response.data.currency === "NGN") {
            // Update payment status
            payment.status = Payment_1.PaymentStatus.PAID;
            payment.paymentDate = new Date();
            payment.paymentMethod = response.data.payment_type || "flutterwave";
            payment.metadata = {
                ...payment.metadata,
                flutterwaveTransactionId: response.data.id,
                flutterwaveReference: response.data.flw_ref,
                cardType: response.data.card?.type,
                cardLast4: response.data.card?.last_4digits,
                verifiedAt: new Date(),
            };
            await payment.save();
            // Update inspection status to pending (awaiting inspector assignment)
            const inspection = await Inspection_1.Inspection.findByIdAndUpdate(payment.inspection, {
                status: "pending",
            }, { new: true }).populate("generator", "generatorId brand model");
            // Update generator status
            if (inspection) {
                await Generator_1.Generator.findByIdAndUpdate(inspection.generator, {
                    status: "under_inspection",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                payment,
                inspection,
            });
        }
        else {
            // Payment verification failed
            payment.status = Payment_1.PaymentStatus.FAILED;
            payment.metadata = {
                ...payment.metadata,
                failureReason: "Payment verification failed",
                flutterwaveResponse: response.data,
                failedAt: new Date(),
            };
            await payment.save();
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }
    }
    catch (error) {
        console.error("Payment verification error:", error);
        return next(new errorHandler_1.default(error.message || "Payment verification failed", 400));
    }
});
// Get payment by transaction reference
exports.getPaymentByReference = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { reference } = req.params;
        const payment = await Payment_1.Payment.findOne({
            transactionReference: reference,
        })
            .populate("user", "name email companyName")
            .populate({
            path: "inspection",
            populate: {
                path: "generator",
                select: "generatorId brand model serialNumber",
            },
        });
        if (!payment) {
            return next(new errorHandler_1.default("Payment not found", 404));
        }
        res.status(200).json({
            success: true,
            payment,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get payment status (for checking payment status)
exports.getPaymentStatus = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { inspectionId } = req.params;
        const payment = await Payment_1.Payment.findOne({
            inspection: inspectionId,
        }).populate("inspection", "status scheduledDate");
        if (!payment) {
            return next(new errorHandler_1.default("Payment not found", 404));
        }
        res.status(200).json({
            success: true,
            paymentStatus: payment.status,
            amount: payment.amount,
            transactionReference: payment.transactionReference,
            paymentDate: payment.paymentDate,
            paymentMethod: payment.paymentMethod,
            inspection: payment.inspection,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get my payments
exports.getMyPayments = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 10));
        const status = req.query.status;
        const skipAmount = (page - 1) * pageSize;
        const query = { user: userId };
        if (status && status !== "all") {
            query.status = status;
        }
        const [payments, totalPayments] = await Promise.all([
            Payment_1.Payment.find(query)
                .populate({
                path: "inspection",
                populate: {
                    path: "generator",
                    select: "generatorId brand model serialNumber",
                },
            })
                .skip(skipAmount)
                .limit(pageSize)
                .sort({ createdAt: -1 })
                .lean(),
            Payment_1.Payment.countDocuments(query),
        ]);
        const totalPages = Math.ceil(totalPayments / pageSize);
        res.status(200).json({
            success: true,
            payments,
            pagination: {
                currentPage: page,
                pageSize,
                totalItems: totalPayments,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get all payments --- for admin
exports.getAllPayments = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 10));
        const status = req.query.status;
        const search = req.query.search;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";
        const skipAmount = (page - 1) * pageSize;
        let query = {};
        if (status && status !== "all") {
            query.status = status;
        }
        if (search && search.trim()) {
            query.transactionReference = {
                $regex: search.trim(),
                $options: "i",
            };
        }
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
        const [payments, totalPayments] = await Promise.all([
            Payment_1.Payment.find(query)
                .populate("user", "name email companyName accountType")
                .populate({
                path: "inspection",
                populate: {
                    path: "generator",
                    select: "generatorId brand model serialNumber",
                },
            })
                .skip(skipAmount)
                .limit(pageSize)
                .sort(sortOptions)
                .lean(),
            Payment_1.Payment.countDocuments(query),
        ]);
        const totalPages = Math.ceil(totalPayments / pageSize);
        res.status(200).json({
            success: true,
            payments,
            pagination: {
                currentPage: page,
                pageSize,
                totalItems: totalPayments,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            filters: {
                status: status || null,
                search: search || null,
                sortBy,
                sortOrder,
            },
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get payment statistics --- for admin
exports.getPaymentStatistics = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const [totalPayments, paidPayments, pendingPayments, failedPayments, totalRevenue, revenueThisMonth,] = await Promise.all([
            Payment_1.Payment.countDocuments(),
            Payment_1.Payment.countDocuments({ status: "paid" }),
            Payment_1.Payment.countDocuments({ status: "pending" }),
            Payment_1.Payment.countDocuments({ status: "failed" }),
            Payment_1.Payment.aggregate([
                { $match: { status: "paid" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
            Payment_1.Payment.aggregate([
                {
                    $match: {
                        status: "paid",
                        paymentDate: {
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        },
                    },
                },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
        ]);
        res.status(200).json({
            success: true,
            statistics: {
                totalPayments,
                byStatus: {
                    paid: paidPayments,
                    pending: pendingPayments,
                    failed: failedPayments,
                },
                revenue: {
                    total: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
                    thisMonth: revenueThisMonth.length > 0 ? revenueThisMonth[0].total : 0,
                },
            },
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Update payment status --- for admin (manual verification)
exports.updatePaymentStatus = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, paymentMethod, notes } = req.body;
        if (!status) {
            return next(new errorHandler_1.default("Status is required", 400));
        }
        const payment = await Payment_1.Payment.findById(id);
        if (!payment) {
            return next(new errorHandler_1.default("Payment not found", 404));
        }
        payment.status = status;
        if (paymentMethod) {
            payment.paymentMethod = paymentMethod;
        }
        if (status === "paid" && !payment.paymentDate) {
            payment.paymentDate = new Date();
        }
        if (notes) {
            payment.metadata = {
                ...payment.metadata,
                adminNotes: notes,
                manuallyVerifiedBy: req.user?._id,
                manuallyVerifiedAt: new Date(),
            };
        }
        await payment.save();
        // If payment is marked as paid, update inspection status
        if (status === "paid") {
            await Inspection_1.Inspection.findByIdAndUpdate(payment.inspection, {
                status: "pending",
            });
            // Update generator status
            const inspection = await Inspection_1.Inspection.findById(payment.inspection);
            if (inspection) {
                await Generator_1.Generator.findByIdAndUpdate(inspection.generator, {
                    status: "under_inspection",
                });
            }
        }
        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            payment,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Initiate refund --- for admin
exports.initiateRefund = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason, amount: refundAmount } = req.body;
        const payment = await Payment_1.Payment.findById(id).populate("inspection");
        if (!payment) {
            return next(new errorHandler_1.default("Payment not found", 404));
        }
        if (payment.status !== "paid") {
            return next(new errorHandler_1.default("Can only refund paid payments", 400));
        }
        // Check if payment was made through Flutterwave
        const flutterwaveTransactionId = payment.metadata?.flutterwaveTransactionId;
        if (!flutterwaveTransactionId) {
            return next(new errorHandler_1.default("Cannot process refund - no Flutterwave transaction ID found", 400));
        }
        const amount = refundAmount || payment.amount;
        // Prepare refund data
        const refundData = {
            amount,
            currency: "NGN",
            reference: `REFUND-${(0, uuid_1.v4)()}`,
            meta: {
                paymentId: payment._id,
                inspectionId: payment.inspection,
                reason: reason || "Refund requested by admin",
                refundedBy: req.user?._id,
            },
        };
        // Process refund with Flutterwave
        const response = await axios_1.default.post(`https://api.flutterwave.com/v3/transactions/${flutterwaveTransactionId}/refund`, refundData, {
            headers: {
                Authorization: `Bearer ${config_1.default.FLW_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });
        if (response.data?.status === "success") {
            // Update payment status
            payment.status = Payment_1.PaymentStatus.REFUNDED;
            payment.metadata = {
                ...payment.metadata,
                refundReason: reason,
                refundAmount: amount,
                refundDate: new Date(),
                refundedBy: req.user?._id,
                refundReference: refundData.reference,
                flutterwaveRefundData: response.data.data,
            };
            await payment.save();
            // Cancel associated inspection
            await Inspection_1.Inspection.findByIdAndUpdate(payment.inspection, {
                status: "cancelled",
            });
            res.status(200).json({
                success: true,
                message: "Refund processed successfully",
                payment,
                refundData: response.data.data,
            });
        }
        else {
            return next(new errorHandler_1.default("Refund processing failed", 400));
        }
    }
    catch (error) {
        // Handle Flutterwave API errors
        if (error.response?.data) {
            return next(new errorHandler_1.default(error.response.data.message || "Refund processing failed", 400));
        }
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Handle Flutterwave webhook
exports.handleWebhook = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const signature = req.headers["verif-hash"];
        // Verify webhook signature
        if (!signature || signature !== config_1.default.FLW_WEBHOOK_HASH) {
            return res.status(401).json({ message: "Unauthorized webhook" });
        }
        const payload = req.body;
        // Handle successful charge
        if (payload.event === "charge.completed" &&
            payload.data.status === "successful") {
            const tx_ref = payload.data.tx_ref;
            const payment = await Payment_1.Payment.findOneAndUpdate({ transactionReference: tx_ref }, {
                status: "paid",
                paymentDate: new Date(),
                paymentMethod: payload.data.payment_type || "flutterwave",
                metadata: {
                    flutterwaveTransactionId: payload.data.id,
                    flutterwaveReference: payload.data.flw_ref,
                    cardType: payload.data.card?.type,
                    cardLast4: payload.data.card?.last_4digits,
                    webhookVerifiedAt: new Date(),
                },
            }, { new: true });
            if (payment) {
                // Update inspection status
                await Inspection_1.Inspection.findByIdAndUpdate(payment.inspection, {
                    status: "pending",
                });
                // Update generator status
                const inspection = await Inspection_1.Inspection.findById(payment.inspection);
                if (inspection) {
                    await Generator_1.Generator.findByIdAndUpdate(inspection.generator, {
                        status: "under_inspection",
                    });
                }
                console.log(`✅ Payment ${payment._id} confirmed via webhook`);
            }
        }
        // Handle refund completed
        if (payload.event === "refund.completed") {
            const tx_ref = payload.data.tx_ref;
            const payment = await Payment_1.Payment.findOneAndUpdate({ transactionReference: tx_ref }, {
                status: "refunded",
                metadata: {
                    refundCompletedAt: new Date(),
                    refundWebhookData: payload.data,
                },
            }, { new: true });
            if (payment) {
                console.log(`✅ Refund for payment ${payment._id} completed via webhook`);
            }
        }
        res.status(200).json({ status: "success" });
    }
    catch (error) {
        console.error("Webhook handling error:", error.message);
        return next(new errorHandler_1.default(error.message || "Webhook handling failed", 500));
    }
});
