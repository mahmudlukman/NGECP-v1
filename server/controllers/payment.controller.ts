import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import { Payment, PaymentStatus } from "../models/Payment";
import { Inspection } from "../models/Inspection";

export const verifyPayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { transactionReference, paymentMethod } = req.body;

      if (!transactionReference) {
        return next(
          new ErrorHandler("Transaction reference is required", 400)
        );
      }

      const payment = await Payment.findOne({ transactionReference });

      if (!payment) {
        return next(new ErrorHandler("Payment not found", 404));
      }

      if (payment.status === "paid") {
        return next(new ErrorHandler("Payment already verified", 400));
      }

      // Here you would integrate with your payment gateway (Paystack, Flutterwave, etc.)
      // For now, we'll just update the status

      payment.status = PaymentStatus.PAID;
      payment.paymentDate = new Date();
      payment.paymentMethod = paymentMethod || "online";
      await payment.save();

      // Update inspection status
      await Inspection.findByIdAndUpdate(payment.inspection, {
        status: "pending", // Changed from pending to awaiting inspector assignment
      });

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        payment,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
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
        payment.metadata = { ...payment.metadata, adminNotes: notes };
      }

      await payment.save();

      // If payment is marked as paid, update inspection status
      if (status === "paid") {
        await Inspection.findByIdAndUpdate(payment.inspection, {
          status: "pending",
        });
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
      const { reason } = req.body;

      const payment = await Payment.findById(id);

      if (!payment) {
        return next(new ErrorHandler("Payment not found", 404));
      }

      if (payment.status !== "paid") {
        return next(
          new ErrorHandler("Can only refund paid payments", 400)
        );
      }

      payment.status = PaymentStatus.REFUNDED;
      payment.metadata = {
        ...payment.metadata,
        refundReason: reason,
        refundDate: new Date(),
        refundedBy: req.user?._id,
      };

      await payment.save();

      // Cancel associated inspection
      await Inspection.findByIdAndUpdate(payment.inspection, {
        status: "cancelled",
      });

      res.status(200).json({
        success: true,
        message: "Refund initiated successfully",
        payment,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);