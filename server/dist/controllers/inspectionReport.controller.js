"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInspectionReport = exports.getMyReports = exports.getAllReports = exports.approveInspectionReport = exports.updateInspectionReport = exports.getReportById = exports.getReportByInspectionId = exports.createInspectionReport = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const InspectionReport_1 = require("../models/InspectionReport");
const Inspection_1 = require("../models/Inspection");
const Generator_1 = require("../models/Generator");
const mongoose_1 = __importDefault(require("mongoose"));
// Create inspection report --- for admin/editor
exports.createInspectionReport = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const inspectorId = req.user?._id;
        const { inspectionId, overallCompliance, complianceScore, emissionsTest, noiseLevel, fuelEfficiency, maintenanceStatus, safetyCompliance, recommendations, requiredActions, nextInspectionDate, attachments, } = req.body;
        if (!inspectionId) {
            return next(new errorHandler_1.default("Inspection ID is required", 400));
        }
        // Verify inspection exists
        const inspection = await Inspection_1.Inspection.findById(inspectionId).populate("generator");
        if (!inspection) {
            return next(new errorHandler_1.default("Inspection not found", 404));
        }
        // Check if report already exists
        const existingReport = await InspectionReport_1.InspectionReport.findOne({
            inspection: inspectionId,
        });
        if (existingReport) {
            return next(new errorHandler_1.default("Report already exists for this inspection", 400));
        }
        // Verify all required test results are provided
        if (!emissionsTest ||
            !noiseLevel ||
            !fuelEfficiency ||
            !maintenanceStatus ||
            !safetyCompliance) {
            return next(new errorHandler_1.default("All test results are required", 400));
        }
        // Get generator ID - handle both populated and non-populated cases
        const generatorId = typeof inspection.generator === "object" &&
            inspection.generator !== null
            ? inspection.generator._id
            : inspection.generator;
        // Create report
        const report = await InspectionReport_1.InspectionReport.create({
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
        inspection.report = report._id;
        inspection.status = Inspection_1.InspectionStatus.COMPLETED;
        inspection.completedDate = new Date();
        await inspection.save();
        // Update generator with compliance information
        const generator = await Generator_1.Generator.findById(generatorId);
        if (generator) {
            generator.complianceScore = complianceScore;
            generator.lastInspectionDate = new Date();
            generator.nextInspectionDue = nextInspectionDate
                ? new Date(nextInspectionDate)
                : undefined;
            generator.status = overallCompliance
                ? Generator_1.GeneratorStatus.COMPLIANT
                : Generator_1.GeneratorStatus.NON_COMPLIANT;
            await generator.save();
        }
        const populatedReport = await InspectionReport_1.InspectionReport.findById(report._id)
            .populate("inspection")
            .populate("generator", "generatorId brand model serialNumber")
            .populate("inspector", "name email");
        res.status(201).json({
            success: true,
            message: "Inspection report created successfully",
            report: populatedReport,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get report by inspection ID
exports.getReportByInspectionId = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { inspectionId } = req.params;
        const report = await InspectionReport_1.InspectionReport.findOne({
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
            return next(new errorHandler_1.default("Report not found", 404));
        }
        res.status(200).json({
            success: true,
            report,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get report by ID
exports.getReportById = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const report = await InspectionReport_1.InspectionReport.findById(id)
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
            return next(new errorHandler_1.default("Report not found", 404));
        }
        res.status(200).json({
            success: true,
            report,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Update inspection report --- for admin/editor
exports.updateInspectionReport = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const inspectorId = req.user?._id;
        const report = await InspectionReport_1.InspectionReport.findById(id);
        if (!report) {
            return next(new errorHandler_1.default("Report not found", 404));
        }
        // Don't allow updates if report is approved (only admin can)
        if (report.isApproved) {
            return next(new errorHandler_1.default("Cannot update approved report. Contact admin.", 400));
        }
        const { overallCompliance, complianceScore, emissionsTest, noiseLevel, fuelEfficiency, maintenanceStatus, safetyCompliance, recommendations, requiredActions, nextInspectionDate, attachments, } = req.body;
        // Update fields
        if (overallCompliance !== undefined)
            report.overallCompliance = overallCompliance;
        if (complianceScore !== undefined)
            report.complianceScore = complianceScore;
        if (emissionsTest)
            report.emissionsTest = emissionsTest;
        if (noiseLevel)
            report.noiseLevel = noiseLevel;
        if (fuelEfficiency)
            report.fuelEfficiency = fuelEfficiency;
        if (maintenanceStatus)
            report.maintenanceStatus = maintenanceStatus;
        if (safetyCompliance)
            report.safetyCompliance = safetyCompliance;
        if (recommendations)
            report.recommendations = recommendations;
        if (requiredActions)
            report.requiredActions = requiredActions;
        if (nextInspectionDate)
            report.nextInspectionDate = new Date(nextInspectionDate);
        if (attachments)
            report.attachments = attachments;
        await report.save();
        // Update generator compliance score if changed
        if (complianceScore !== undefined) {
            await Generator_1.Generator.findByIdAndUpdate(report.generator, {
                complianceScore,
                status: overallCompliance ? "compliant" : "non_compliant",
            });
        }
        const updatedReport = await InspectionReport_1.InspectionReport.findById(id)
            .populate("inspection")
            .populate("generator", "generatorId brand model serialNumber")
            .populate("inspector", "name email");
        res.status(200).json({
            success: true,
            message: "Report updated successfully",
            report: updatedReport,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
/**
 * @desc Approve an inspection report
 * @route PATCH /api/inspection-reports/:id/approve
 * @access Admin
 */
exports.approveInspectionReport = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;
        // Ensure ID is valid before querying
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return next(new errorHandler_1.default("Invalid report ID", 400));
        }
        // Fetch report (typed properly)
        const report = (await InspectionReport_1.InspectionReport.findById(id));
        if (!report) {
            return next(new errorHandler_1.default("Report not found", 404));
        }
        if (report.isApproved) {
            return next(new errorHandler_1.default("Report already approved", 400));
        }
        // Update approval fields
        report.isApproved = true;
        report.approvedBy = adminId;
        report.approvalDate = new Date();
        await report.save();
        res.status(200).json({
            success: true,
            message: "Report approved successfully",
            report,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get all reports --- for admin/editor
exports.getAllReports = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 10));
        const compliance = req.query.compliance;
        const approved = req.query.approved;
        const search = req.query.search;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";
        const skipAmount = (page - 1) * pageSize;
        let query = {};
        if (compliance === "compliant") {
            query.overallCompliance = true;
        }
        else if (compliance === "non_compliant") {
            query.overallCompliance = false;
        }
        if (approved === "true") {
            query.isApproved = true;
        }
        else if (approved === "false") {
            query.isApproved = false;
        }
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
        let reports;
        let totalReports;
        if (search && search.trim()) {
            // Search in generators first
            const generators = await Generator_1.Generator.find({
                $or: [
                    { generatorId: { $regex: search.trim(), $options: "i" } },
                    { serialNumber: { $regex: search.trim(), $options: "i" } },
                ],
            }).select("_id");
            const generatorIds = generators.map((g) => g._id);
            query.generator = { $in: generatorIds };
        }
        [reports, totalReports] = await Promise.all([
            InspectionReport_1.InspectionReport.find(query)
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
            InspectionReport_1.InspectionReport.countDocuments(query),
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
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get my reports (as generator owner)
exports.getMyReports = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 10));
        const skipAmount = (page - 1) * pageSize;
        // Find all inspections for user's generators
        const userGenerators = await Generator_1.Generator.find({ owner: userId }).select("_id");
        const generatorIds = userGenerators.map((g) => g._id);
        const [reports, totalReports] = await Promise.all([
            InspectionReport_1.InspectionReport.find({ generator: { $in: generatorIds } })
                .populate("generator", "generatorId brand model serialNumber")
                .populate("inspector", "name email")
                .populate("inspection")
                .skip(skipAmount)
                .limit(pageSize)
                .sort({ createdAt: -1 })
                .lean(),
            InspectionReport_1.InspectionReport.countDocuments({
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
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Delete report --- admin only
exports.deleteInspectionReport = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const report = await InspectionReport_1.InspectionReport.findById(id);
        if (!report) {
            return next(new errorHandler_1.default("Report not found", 404));
        }
        // Remove report reference from inspection
        await Inspection_1.Inspection.findByIdAndUpdate(report.inspection, {
            $unset: { report: 1 },
            status: "scheduled",
        });
        await InspectionReport_1.InspectionReport.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Report deleted successfully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
