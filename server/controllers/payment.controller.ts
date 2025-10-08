import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import { Payment, PaymentStatus } from "../models/Payment";
import { Inspection } from "../models/Inspection";
import { Generator } from "../models/Generator";
import { User } from "../models/User";
import ErrorHandler from "../utils/errorHandler";
import axios from "axios";
import config from "../config";
import { v4 as uuidv4 } from "uuid";

const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(config.FLW_PUBLIC_KEY, config.FLW_SECRET_KEY);

// Initialize payment (called after scheduling inspection)
export const initializePayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { inspectionId, amount, redirect_url } = req.body;
      const userId = req.user?._id;

      if (!inspectionId || !amount || !redirect_url) {
        return next(
          new ErrorHandler(
            "Missing required fields: inspectionId, amount, redirect_url",
            400
          )
        );
      }

      // Verify inspection exists and belongs to user
      const inspection = await Inspection.findById(inspectionId)
        .populate("generator", "generatorId brand model serialNumber")
        .populate("owner", "name email companyName accountType");

      if (!inspection) {
        return next(new ErrorHandler("Inspection not found", 404));
      }

      if (inspection.owner._id.toString() !== userId?.toString()) {
        return next(
          new ErrorHandler(
            "You don't have permission to pay for this inspection",
            403
          )
        );
      }

      // Check if payment already exists
      const existingPayment = await Payment.findOne({
        inspection: inspectionId,
      });

      let payment;
      let tx_ref;

      if (existingPayment) {
        // If payment exists and is already paid, return error
        if (existingPayment.status === "paid") {
          return next(
            new ErrorHandler("Payment already completed for this inspection", 400)
          );
        }
        // Reuse existing payment record
        payment = existingPayment;
        tx_ref = payment.transactionReference;
      } else {
        // Create new payment record
        tx_ref = `GEN-INS-${uuidv4()}`;
        payment = await Payment.create({
          user: userId,
          inspection: inspectionId,
          amount,
          transactionReference: tx_ref,
          status: "pending",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Get generator info for payment description
      const generator = inspection.generator as any;
      const displayName =
        user.accountType === "individual" ? user.name : user.companyName;

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
      const response = await axios.post(
        "https://api.flutterwave.com/v3/payments",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${config.FLW_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

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
      } else {
        return next(new ErrorHandler("Payment initialization failed", 400));
      }
    } catch (error: any) {
      // Handle Flutterwave API errors
      if (error.response?.data) {
        return next(
          new ErrorHandler(
            error.response.data.message || "Payment initialization failed",
            400
          )
        );
      }
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Verify payment (callback from Flutterwave)
export const verifyPayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, tx_ref, transaction_id } = req.query;

      if (!status || !tx_ref || !transaction_id) {
        return next(new ErrorHandler("Missing required query parameters", 400));
      }

      // Find payment record
      const payment = await Payment.findOne({
        transactionReference: tx_ref as string,
      }).populate("inspection");

      if (!payment) {
        return next(new ErrorHandler("Payment record not found", 404));
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
        payment.status = PaymentStatus.FAILED;
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
        id: transaction_id as string,
      });

      if (
        response.data.status === "successful" &&
        response.data.amount >= payment.amount &&
        response.data.currency === "NGN"
      ) {
        // Update payment status
        payment.status = PaymentStatus.PAID;
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
        const inspection = await Inspection.findByIdAndUpdate(
          payment.inspection,
          {
            status: "pending",
          },
          { new: true }
        ).populate("generator", "generatorId brand model");

        // Update generator status
        if (inspection) {
          await Generator.findByIdAndUpdate(inspection.generator, {
            status: "under_inspection",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Payment verified successfully",
          payment,
          inspection,
        });
      } else {
        // Payment verification failed
        payment.status = PaymentStatus.FAILED;
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
    } catch (error: any) {
      console.error("Payment verification error:", error);
      return next(
        new ErrorHandler(
          error.message || "Payment verification failed",
          400
        )
      );
    }
  }
);

// Get payment by transaction reference
export const getPaymentByReference = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reference } = req.params;

      const payment = await Payment.findOne({
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
        return next(new ErrorHandler("Payment not found", 404));
      }

      res.status(200).json({
        success: true,
        payment,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get payment status (for checking payment status)
export const getPaymentStatus = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { inspectionId } = req.params;

      const payment = await Payment.findOne({
        inspection: inspectionId,
      }).populate("inspection", "status scheduledDate");

      if (!payment) {
        return next(new ErrorHandler("Payment not found", 404));
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get my payments
export const getMyPayments = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.min(
        50,
        Math.max(1, parseInt(req.query.pageSize as string) || 10)
      );
      const status = req.query.status as string;

      const skipAmount = (page - 1) * pageSize;

      const query: any = { user: userId };

      if (status && status !== "all") {
        query.status = status;
      }

      const [payments, totalPayments] = await Promise.all([
        Payment.find(query)
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
        Payment.countDocuments(query),
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get all payments --- for admin
export const getAllPayments = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.min(
        50,
        Math.max(1, parseInt(req.query.pageSize as string) || 10)
      );
      const status = req.query.status as string;
      const search = req.query.search as string;
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

      const skipAmount = (page - 1) * pageSize;

      let query: any = {};

      if (status && status !== "all") {
        query.status = status;
      }

      if (search && search.trim()) {
        query.transactionReference = {
          $regex: search.trim(),
          $options: "i",
        };
      }

      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

      const [payments, totalPayments] = await Promise.all([
        Payment.find(query)
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
        Payment.countDocuments(query),
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get payment statistics --- for admin
export const getPaymentStatistics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [
        totalPayments,
        paidPayments,
        pendingPayments,
        failedPayments,
        totalRevenue,
        revenueThisMonth,
      ] = await Promise.all([
        Payment.countDocuments(),
        Payment.countDocuments({ status: "paid" }),
        Payment.countDocuments({ status: "pending" }),
        Payment.countDocuments({ status: "failed" }),
        Payment.aggregate([
          { $match: { status: "paid" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Payment.aggregate([
          {
            $match: {
              status: "paid",
              paymentDate: {
                $gte: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  1
                ),
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
            thisMonth:
              revenueThisMonth.length > 0 ? revenueThisMonth[0].total : 0,
          },
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update payment status --- for admin (manual verification)
export const updatePaymentStatus = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, paymentMethod, notes } = req.body;

      if (!status) {
        return next(new ErrorHandler("Status is required", 400));
      }

      const payment = await Payment.findById(id);

      if (!payment) {
        return next(new ErrorHandler("Payment not found", 404));
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
        await Inspection.findByIdAndUpdate(payment.inspection, {
          status: "pending",
        });
        
        // Update generator status
        const inspection = await Inspection.findById(payment.inspection);
        if (inspection) {
          await Generator.findByIdAndUpdate(inspection.generator, {
            status: "under_inspection",
          });
        }
      }

      res.status(200).json({
        success: true,
        message: "Payment status updated successfully",
        payment,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Initiate refund --- for admin
export const initiateRefund = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { reason, amount: refundAmount } = req.body;

      const payment = await Payment.findById(id).populate("inspection");

      if (!payment) {
        return next(new ErrorHandler("Payment not found", 404));
      }

      if (payment.status !== "paid") {
        return next(new ErrorHandler("Can only refund paid payments", 400));
      }

      // Check if payment was made through Flutterwave
      const flutterwaveTransactionId = payment.metadata?.flutterwaveTransactionId;

      if (!flutterwaveTransactionId) {
        return next(
          new ErrorHandler(
            "Cannot process refund - no Flutterwave transaction ID found",
            400
          )
        );
      }

      const amount = refundAmount || payment.amount;

      // Prepare refund data
      const refundData = {
        amount,
        currency: "NGN",
        reference: `REFUND-${uuidv4()}`,
        meta: {
          paymentId: payment._id,
          inspectionId: payment.inspection,
          reason: reason || "Refund requested by admin",
          refundedBy: req.user?._id,
        },
      };

      // Process refund with Flutterwave
      const response = await axios.post(
        `https://api.flutterwave.com/v3/transactions/${flutterwaveTransactionId}/refund`,
        refundData,
        {
          headers: {
            Authorization: `Bearer ${config.FLW_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status === "success") {
        // Update payment status
        payment.status = PaymentStatus.REFUNDED;
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
        await Inspection.findByIdAndUpdate(payment.inspection, {
          status: "cancelled",
        });

        res.status(200).json({
          success: true,
          message: "Refund processed successfully",
          payment,
          refundData: response.data.data,
        });
      } else {
        return next(new ErrorHandler("Refund processing failed", 400));
      }
    } catch (error: any) {
      // Handle Flutterwave API errors
      if (error.response?.data) {
        return next(
          new ErrorHandler(
            error.response.data.message || "Refund processing failed",
            400
          )
        );
      }
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Handle Flutterwave webhook
export const handleWebhook = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers["verif-hash"];

      // Verify webhook signature
      if (!signature || signature !== config.FLW_WEBHOOK_HASH) {
        return res.status(401).json({ message: "Unauthorized webhook" });
      }

      const payload = req.body;

      // Handle successful charge
      if (
        payload.event === "charge.completed" &&
        payload.data.status === "successful"
      ) {
        const tx_ref = payload.data.tx_ref;

        const payment = await Payment.findOneAndUpdate(
          { transactionReference: tx_ref },
          {
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
          },
          { new: true }
        );

        if (payment) {
          // Update inspection status
          await Inspection.findByIdAndUpdate(payment.inspection, {
            status: "pending",
          });

          // Update generator status
          const inspection = await Inspection.findById(payment.inspection);
          if (inspection) {
            await Generator.findByIdAndUpdate(inspection.generator, {
              status: "under_inspection",
            });
          }

          console.log(`✅ Payment ${payment._id} confirmed via webhook`);
        }
      }

      // Handle refund completed
      if (payload.event === "refund.completed") {
        const tx_ref = payload.data.tx_ref;

        const payment = await Payment.findOneAndUpdate(
          { transactionReference: tx_ref },
          {
            status: "refunded",
            metadata: {
              refundCompletedAt: new Date(),
              refundWebhookData: payload.data,
            },
          },
          { new: true }
        );

        if (payment) {
          console.log(`✅ Refund for payment ${payment._id} completed via webhook`);
        }
      }

      res.status(200).json({ status: "success" });
    } catch (error: any) {
      console.error("Webhook handling error:", error.message);
      return next(
        new ErrorHandler(error.message || "Webhook handling failed", 500)
      );
    }
  }
);