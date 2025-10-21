import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import { Generator, GeneratorStatus } from "../models/Generator";
import ErrorHandler from "../utils/errorHandler";
import mongoose, { FilterQuery } from "mongoose";
import {
  Inspection,
  IInspection,
  InspectionStatus,
} from "../models/Inspection";
import { Payment } from "../models/Payment";
import { User } from "../models/User";
import { InspectionFee } from "../models/InspectionFee";

// Schedule inspection (create inspection with payment)
export const scheduleInspection = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { generatorId, scheduledDate, amount } = req.body;
      const owner = req.user?._id;

      if (!generatorId || !scheduledDate || !amount) {
        return next(
          new ErrorHandler(
            "Generator ID, scheduled date, and amount are required",
            400
          )
        );
      }

      // Verify generator exists and belongs to user
      const generator = await Generator.findById(generatorId);

      if (!generator) {
        return next(new ErrorHandler("Generator not found", 404));
      }

      if (generator.owner.toString() !== owner?.toString()) {
        return next(
          new ErrorHandler(
            "You don't have permission to schedule inspection for this generator",
            403
          )
        );
      }

      // Check for existing pending/scheduled inspections
      const existingInspection = await Inspection.findOne({
        generator: generatorId,
        status: { $in: ["pending", "scheduled"] },
      });

      if (existingInspection) {
        return next(
          new ErrorHandler(
            "There is already a pending or scheduled inspection for this generator",
            400
          )
        );
      }

      // Generate transaction reference
      const transactionReference = `TXN-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      // Create payment record
      const payment = await Payment.create({
        user: owner,
        inspection: null,
        amount,
        transactionReference,
        status: "pending",
      });

      // Create inspection
      const inspection = await Inspection.create({
        generator: generatorId,
        owner,
        scheduledDate: new Date(scheduledDate),
        payment: payment._id,
        location: generator.location,
      });

      // Update payment with inspection ID
      payment.inspection = inspection._id as mongoose.Types.ObjectId;
      await payment.save();

      // Update generator status
      generator.status = GeneratorStatus.UNDER_INSPECTION;
      await generator.save();

      const populatedInspection = await Inspection.findById(inspection._id)
        .populate("generator", "generatorId brand model serialNumber")
        .populate("payment");

      res.status(201).json({
        success: true,
        message:
          "Inspection scheduled successfully. Please proceed to payment.",
        inspection: populatedInspection,
        paymentReference: transactionReference,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get inspection fees (admin-only)
export const getInspectionFee = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let fee = await InspectionFee.findOne();

      // Create default fee if none exists
      if (!fee) {
        fee = await InspectionFee.create({
          amount: 5000,
          description: "Standard inspection fee for all generator types",
        });
      }

      res.status(200).json({
        success: true,
        fee,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update inspection fees (admin-only)
export const updateInspectionFee = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, description } = req.body;
      const updatedBy = req.user?._id;

      if (!amount || amount < 0) {
        return next(new ErrorHandler("Please provide a valid amount", 400));
      }

      let fee = await InspectionFee.findOne();

      if (!fee) {
        // Create if doesn't exist
        fee = await InspectionFee.create({
          amount,
          description:
            description || "Standard inspection fee for all generator types",
          updatedBy,
        });
      } else {
        // Update existing
        fee.amount = amount;
        if (description) fee.description = description;
        fee.updatedBy = updatedBy as mongoose.Types.ObjectId;
        await fee.save();
      }

      res.status(200).json({
        success: true,
        message: "Inspection fee updated successfully",
        fee,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get my inspections
export const getMyInspections = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const owner = req.user?._id;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.min(
        50,
        Math.max(1, parseInt(req.query.pageSize as string) || 10)
      );
      const status = req.query.status as string;

      const skipAmount = (page - 1) * pageSize;

      const query: FilterQuery<IInspection> = { owner };

      if (status && status !== "all") {
        query.status = status;
      }

      const [inspections, totalInspections] = await Promise.all([
        Inspection.find(query)
          .populate(
            "generator",
            "generatorId brand model serialNumber location"
          )
          .populate("payment")
          .populate("inspector", "name email")
          .populate("report")
          .skip(skipAmount)
          .limit(pageSize)
          .sort({ createdAt: -1 })
          .lean(),
        Inspection.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalInspections / pageSize);

      res.status(200).json({
        success: true,
        inspections,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems: totalInspections,
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

// Get inspection by ID
export const getInspectionById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;
      const userRole = req.user?.role;

      const inspection = await Inspection.findById(id)
        .populate("generator")
        .populate("owner", "name email companyName accountType phoneNumber")
        .populate("payment")
        .populate("inspector", "name email")
        .populate("report");

      if (!inspection) {
        return next(new ErrorHandler("Inspection not found", 404));
      }

      // Check permission
      if (
        userRole !== "admin" &&
        userRole !== "editor" &&
        inspection.owner._id.toString() !== userId?.toString()
      ) {
        return next(
          new ErrorHandler(
            "You don't have permission to view this inspection",
            403
          )
        );
      }

      res.status(200).json({
        success: true,
        inspection,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get all inspections --- for admin/editor
export const getAllInspections = catchAsyncError(
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

      let query: FilterQuery<IInspection> = {};

      if (status && status !== "all") {
        query.status = status;
      }

      // For search, we need to search in populated fields
      let inspections;
      let totalInspections;

      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

      if (search && search.trim()) {
        // First get generators matching the search
        const generators = await Generator.find({
          $or: [
            { generatorId: { $regex: search.trim(), $options: "i" } },
            { brand: { $regex: search.trim(), $options: "i" } },
            { serialNumber: { $regex: search.trim(), $options: "i" } },
          ],
        }).select("_id");

        const generatorIds = generators.map((g) => g._id);
        query.generator = { $in: generatorIds };
      }

      [inspections, totalInspections] = await Promise.all([
        Inspection.find(query)
          .populate("generator", "generatorId brand model serialNumber")
          .populate("owner", "name email companyName accountType")
          .populate("payment", "amount status transactionReference")
          .populate("inspector", "name email")
          .skip(skipAmount)
          .limit(pageSize)
          .sort(sortOptions)
          .lean(),
        Inspection.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalInspections / pageSize);

      res.status(200).json({
        success: true,
        inspections,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems: totalInspections,
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

// Assign inspector to inspection --- for admin/editor
export const assignInspector = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { inspectorId } = req.body;

      if (!inspectorId) {
        return next(new ErrorHandler("Inspector ID is required", 400));
      }

      // Verify inspector exists and has appropriate role
      const inspector = await User.findById(inspectorId);

      if (!inspector) {
        return next(new ErrorHandler("Inspector not found", 404));
      }

      if (inspector.role !== "admin" && inspector.role !== "editor") {
        return next(new ErrorHandler("Selected user is not an inspector", 400));
      }

      const inspection = await Inspection.findById(id);

      if (!inspection) {
        return next(new ErrorHandler("Inspection not found", 404));
      }

      // Check if payment is completed
      const payment = await Payment.findById(inspection.payment);

      if (!payment || payment.status !== "paid") {
        return next(
          new ErrorHandler(
            "Cannot assign inspector. Payment not completed",
            400
          )
        );
      }

      inspection.inspector = inspectorId;
      inspection.status = InspectionStatus.SCHEDULED;
      await inspection.save();

      const updatedInspection = await Inspection.findById(id)
        .populate("generator")
        .populate("owner", "name email companyName")
        .populate("inspector", "name email");

      res.status(200).json({
        success: true,
        message: "Inspector assigned successfully",
        inspection: updatedInspection,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update inspection status --- for admin/editor
export const updateInspectionStatus = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!status) {
        return next(new ErrorHandler("Status is required", 400));
      }

      const inspection = await Inspection.findById(id);

      if (!inspection) {
        return next(new ErrorHandler("Inspection not found", 404));
      }

      inspection.status = status;

      if (notes) {
        inspection.notes = notes;
      }

      if (status === "completed") {
        inspection.completedDate = new Date();
      }

      await inspection.save();

      res.status(200).json({
        success: true,
        message: "Inspection status updated successfully",
        inspection,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Cancel inspection
export const cancelInspection = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;
      const userRole = req.user?.role;

      const inspection = await Inspection.findById(id);

      if (!inspection) {
        return next(new ErrorHandler("Inspection not found", 404));
      }

      // Check permission
      if (
        userRole !== "admin" &&
        inspection.owner.toString() !== userId?.toString()
      ) {
        return next(
          new ErrorHandler(
            "You don't have permission to cancel this inspection",
            403
          )
        );
      }

      if (inspection.status === "completed") {
        return next(
          new ErrorHandler("Cannot cancel completed inspection", 400)
        );
      }

      inspection.status = InspectionStatus.CANCELLED;
      await inspection.save();

      // Update generator status back to active
      await Generator.findByIdAndUpdate(inspection.generator, {
        status: "active",
      });

      res.status(200).json({
        success: true,
        message: "Inspection cancelled successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete inspection --- for admin only
export const deleteInspection = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const inspection = await Inspection.findById(id);

      if (!inspection) {
        return next(new ErrorHandler("Inspection not found", 404));
      }

      // Prevent deletion of completed inspections with reports
      if (inspection.status === "completed" && inspection.report) {
        return next(
          new ErrorHandler(
            "Cannot delete completed inspection with an existing report",
            400
          )
        );
      }

      // Delete associated payment if it exists and is not paid
      if (inspection.payment) {
        const payment = await Payment.findById(inspection.payment);
        if (payment && payment.status !== "paid") {
          await Payment.findByIdAndDelete(inspection.payment);
        } else if (payment && payment.status === "paid") {
          return next(
            new ErrorHandler(
              "Cannot delete inspection with completed payment. Consider cancelling instead.",
              400
            )
          );
        }
      }

      // Update generator status back to active if it's under inspection
      const generator = await Generator.findById(inspection.generator);
      if (generator && generator.status === GeneratorStatus.UNDER_INSPECTION) {
        generator.status = GeneratorStatus.ACTIVE;
        await generator.save();
      }

      // Delete the inspection
      await Inspection.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Inspection deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
