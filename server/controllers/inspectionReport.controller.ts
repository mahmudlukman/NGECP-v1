import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import {
  InspectionReport,
  IInspectionReport,
} from "../models/InspectionReport";
import { Inspection, InspectionStatus } from "../models/Inspection";
import { Generator, GeneratorStatus } from "../models/Generator";
import mongoose from "mongoose";

// Create inspection report --- for admin/editor
export const createInspectionReport = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inspectorId = req.user?._id;
      const {
        inspectionId,
        overallCompliance,
        complianceScore,
        emissionsTest,
        noiseLevel,
        fuelEfficiency,
        maintenanceStatus,
        safetyCompliance,
        recommendations,
        requiredActions,
        nextInspectionDate,
        attachments,
      } = req.body;

      if (!inspectionId) {
        return next(new ErrorHandler("Inspection ID is required", 400));
      }

      // Verify inspection exists
      const inspection = await Inspection.findById(inspectionId).populate(
        "generator"
      );

      if (!inspection) {
        return next(new ErrorHandler("Inspection not found", 404));
      }

      // Check if inspection is assigned to this inspector or user is admin
      if (
        req.user?.role !== "admin" &&
        inspection.inspector?.toString() !== inspectorId?.toString()
      ) {
        return next(
          new ErrorHandler("You are not assigned to this inspection", 403)
        );
      }

      // Check if report already exists
      const existingReport = await InspectionReport.findOne({
        inspection: inspectionId,
      });

      if (existingReport) {
        return next(
          new ErrorHandler("Report already exists for this inspection", 400)
        );
      }

      // Verify all required test results are provided
      if (
        !emissionsTest ||
        !noiseLevel ||
        !fuelEfficiency ||
        !maintenanceStatus ||
        !safetyCompliance
      ) {
        return next(new ErrorHandler("All test results are required", 400));
      }

      // Get generator ID - handle both populated and non-populated cases
      const generatorId =
        typeof inspection.generator === "object" &&
        inspection.generator !== null
          ? (inspection.generator as any)._id
          : inspection.generator;

      // Create report
      const report = await InspectionReport.create({
        inspection: inspectionId,
        generator: generatorId,
        inspector: inspectorId,
        overallCompliance,
        complianceScore,
        emissionsTest,
        noiseLevel,
        fuelEfficiency,
        maintenanceStatus,
        safetyCompliance,
        recommendations: recommendations || [],
        requiredActions: requiredActions || [],
        nextInspectionDate: nextInspectionDate
          ? new Date(nextInspectionDate)
          : undefined,
        attachments: attachments || [],
      });

      // Update inspection with report reference
      inspection.report = report._id as any;
      inspection.status = InspectionStatus.COMPLETED;
      inspection.completedDate = new Date();
      await inspection.save();

      // Update generator with compliance information
      const generator = await Generator.findById(generatorId);
      if (generator) {
        generator.complianceScore = complianceScore;
        generator.lastInspectionDate = new Date();
        generator.nextInspectionDue = nextInspectionDate
          ? new Date(nextInspectionDate)
          : undefined;
        generator.status = overallCompliance
          ? GeneratorStatus.COMPLIANT
          : GeneratorStatus.NON_COMPLIANT;
        await generator.save();
      }

      const populatedReport = await InspectionReport.findById(report._id)
        .populate("inspection")
        .populate("generator", "generatorId brand model serialNumber")
        .populate("inspector", "name email");

      res.status(201).json({
        success: true,
        message: "Inspection report created successfully",
        report: populatedReport,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get report by inspection ID
export const getReportByInspectionId = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { inspectionId } = req.params;
      const userId = req.user?._id;
      const userRole = req.user?.role;

      const report = await InspectionReport.findOne({
        inspection: inspectionId,
      })
        .populate({
          path: "inspection",
          populate: [
            { path: "generator" },
            { path: "owner", select: "name email companyName accountType" },
          ],
        })
        .populate("generator", "generatorId brand model serialNumber location")
        .populate("inspector", "name email")
        .populate("approvedBy", "name email");

      if (!report) {
        return next(new ErrorHandler("Report not found", 404));
      }

      // Check permission
      const inspection = report.inspection as any;
      if (
        userRole !== "admin" &&
        userRole !== "editor" &&
        inspection.owner._id.toString() !== userId?.toString()
      ) {
        return next(
          new ErrorHandler("You don't have permission to view this report", 403)
        );
      }

      res.status(200).json({
        success: true,
        report,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get report by ID
export const getReportById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;
      const userRole = req.user?.role;

      const report = await InspectionReport.findById(id)
        .populate({
          path: "inspection",
          populate: [
            { path: "generator" },
            { path: "owner", select: "name email companyName accountType" },
          ],
        })
        .populate("generator", "generatorId brand model serialNumber location")
        .populate("inspector", "name email")
        .populate("approvedBy", "name email");

      if (!report) {
        return next(new ErrorHandler("Report not found", 404));
      }

      // Check permission
      const inspection = report.inspection as any;
      if (
        userRole !== "admin" &&
        userRole !== "editor" &&
        inspection.owner._id.toString() !== userId?.toString()
      ) {
        return next(
          new ErrorHandler("You don't have permission to view this report", 403)
        );
      }

      res.status(200).json({
        success: true,
        report,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update inspection report --- for admin/editor
export const updateInspectionReport = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const inspectorId = req.user?._id;
      const userRole = req.user?.role;

      const report = await InspectionReport.findById(id);

      if (!report) {
        return next(new ErrorHandler("Report not found", 404));
      }

      // Check permission - only the inspector or admin can update
      if (
        userRole !== "admin" &&
        report.inspector.toString() !== inspectorId?.toString()
      ) {
        return next(
          new ErrorHandler(
            "You don't have permission to update this report",
            403
          )
        );
      }

      // Don't allow updates if report is approved (only admin can)
      if (report.isApproved && userRole !== "admin") {
        return next(
          new ErrorHandler("Cannot update approved report. Contact admin.", 400)
        );
      }

      const {
        overallCompliance,
        complianceScore,
        emissionsTest,
        noiseLevel,
        fuelEfficiency,
        maintenanceStatus,
        safetyCompliance,
        recommendations,
        requiredActions,
        nextInspectionDate,
        attachments,
      } = req.body;

      // Update fields
      if (overallCompliance !== undefined)
        report.overallCompliance = overallCompliance;
      if (complianceScore !== undefined)
        report.complianceScore = complianceScore;
      if (emissionsTest) report.emissionsTest = emissionsTest;
      if (noiseLevel) report.noiseLevel = noiseLevel;
      if (fuelEfficiency) report.fuelEfficiency = fuelEfficiency;
      if (maintenanceStatus) report.maintenanceStatus = maintenanceStatus;
      if (safetyCompliance) report.safetyCompliance = safetyCompliance;
      if (recommendations) report.recommendations = recommendations;
      if (requiredActions) report.requiredActions = requiredActions;
      if (nextInspectionDate)
        report.nextInspectionDate = new Date(nextInspectionDate);
      if (attachments) report.attachments = attachments;

      await report.save();

      // Update generator compliance score if changed
      if (complianceScore !== undefined) {
        await Generator.findByIdAndUpdate(report.generator, {
          complianceScore,
          status: overallCompliance ? "compliant" : "non_compliant",
        });
      }

      const updatedReport = await InspectionReport.findById(id)
        .populate("inspection")
        .populate("generator", "generatorId brand model serialNumber")
        .populate("inspector", "name email");

      res.status(200).json({
        success: true,
        message: "Report updated successfully",
        report: updatedReport,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 * @desc Approve an inspection report
 * @route PATCH /api/inspection-reports/:id/approve
 * @access Admin
 */
export const approveInspectionReport = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const adminId = req.user?._id;

      // Ensure ID is valid before querying
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid report ID", 400));
      }

      // Fetch report (typed properly)
      const report = (await InspectionReport.findById(id)) as
        | (mongoose.Document<unknown, {}, IInspectionReport> &
            IInspectionReport)
        | null;

      if (!report) {
        return next(new ErrorHandler("Report not found", 404));
      }

      if (report.isApproved) {
        return next(new ErrorHandler("Report already approved", 400));
      }

      // Update approval fields
      report.isApproved = true;
      report.approvedBy = adminId as mongoose.Types.ObjectId;
      report.approvalDate = new Date();

      await report.save();

      res.status(200).json({
        success: true,
        message: "Report approved successfully",
        report,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get all reports --- for admin/editor
export const getAllReports = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.min(
        50,
        Math.max(1, parseInt(req.query.pageSize as string) || 10)
      );
      const compliance = req.query.compliance as string;
      const approved = req.query.approved as string;
      const search = req.query.search as string;
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

      const skipAmount = (page - 1) * pageSize;

      let query: any = {};

      if (compliance === "compliant") {
        query.overallCompliance = true;
      } else if (compliance === "non_compliant") {
        query.overallCompliance = false;
      }

      if (approved === "true") {
        query.isApproved = true;
      } else if (approved === "false") {
        query.isApproved = false;
      }

      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

      let reports;
      let totalReports;

      if (search && search.trim()) {
        // Search in generators first
        const generators = await Generator.find({
          $or: [
            { generatorId: { $regex: search.trim(), $options: "i" } },
            { serialNumber: { $regex: search.trim(), $options: "i" } },
          ],
        }).select("_id");

        const generatorIds = generators.map((g) => g._id);
        query.generator = { $in: generatorIds };
      }

      [reports, totalReports] = await Promise.all([
        InspectionReport.find(query)
          .populate("generator", "generatorId brand model serialNumber")
          .populate("inspector", "name email")
          .populate("approvedBy", "name email")
          .populate({
            path: "inspection",
            populate: {
              path: "owner",
              select: "name email companyName accountType",
            },
          })
          .skip(skipAmount)
          .limit(pageSize)
          .sort(sortOptions)
          .lean(),
        InspectionReport.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalReports / pageSize);

      res.status(200).json({
        success: true,
        reports,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems: totalReports,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: {
          compliance: compliance || null,
          approved: approved || null,
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

// Get my reports (as generator owner)
export const getMyReports = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.min(
        50,
        Math.max(1, parseInt(req.query.pageSize as string) || 10)
      );

      const skipAmount = (page - 1) * pageSize;

      // Find all inspections for user's generators
      const userGenerators = await Generator.find({ owner: userId }).select(
        "_id"
      );
      const generatorIds = userGenerators.map((g) => g._id);

      const [reports, totalReports] = await Promise.all([
        InspectionReport.find({ generator: { $in: generatorIds } })
          .populate("generator", "generatorId brand model serialNumber")
          .populate("inspector", "name email")
          .populate("inspection")
          .skip(skipAmount)
          .limit(pageSize)
          .sort({ createdAt: -1 })
          .lean(),
        InspectionReport.countDocuments({
          generator: { $in: generatorIds },
        }),
      ]);

      const totalPages = Math.ceil(totalReports / pageSize);

      res.status(200).json({
        success: true,
        reports,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems: totalReports,
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

// Get report statistics --- for admin/editor
export const getReportStatistics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [
        totalReports,
        compliantReports,
        nonCompliantReports,
        approvedReports,
        pendingApprovalReports,
        avgComplianceScore,
      ] = await Promise.all([
        InspectionReport.countDocuments(),
        InspectionReport.countDocuments({ overallCompliance: true }),
        InspectionReport.countDocuments({ overallCompliance: false }),
        InspectionReport.countDocuments({ isApproved: true }),
        InspectionReport.countDocuments({ isApproved: false }),
        InspectionReport.aggregate([
          { $group: { _id: null, avgScore: { $avg: "$complianceScore" } } },
        ]),
      ]);

      // Get common issues
      const commonIssues = await InspectionReport.aggregate([
        { $unwind: "$maintenanceStatus.issues" },
        {
          $group: {
            _id: "$maintenanceStatus.issues",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      res.status(200).json({
        success: true,
        statistics: {
          total: totalReports,
          byCompliance: {
            compliant: compliantReports,
            nonCompliant: nonCompliantReports,
          },
          byApproval: {
            approved: approvedReports,
            pendingApproval: pendingApprovalReports,
          },
          averageComplianceScore:
            avgComplianceScore.length > 0
              ? Math.round(avgComplianceScore[0].avgScore * 100) / 100
              : 0,
          commonIssues,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete report --- admin only
export const deleteInspectionReport = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const report = await InspectionReport.findById(id);

      if (!report) {
        return next(new ErrorHandler("Report not found", 404));
      }

      // Remove report reference from inspection
      await Inspection.findByIdAndUpdate(report.inspection, {
        $unset: { report: 1 },
        status: "scheduled",
      });

      await InspectionReport.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Report deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
