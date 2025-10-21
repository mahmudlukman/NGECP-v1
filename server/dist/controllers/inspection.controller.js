"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInspection = exports.cancelInspection = exports.updateInspectionStatus = exports.assignInspector = exports.getAllInspections = exports.getInspectionById = exports.getMyInspections = exports.updateInspectionFee = exports.getInspectionFee = exports.scheduleInspection = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const Generator_1 = require("../models/Generator");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const Inspection_1 = require("../models/Inspection");
const Payment_1 = require("../models/Payment");
const User_1 = require("../models/User");
const InspectionFee_1 = require("../models/InspectionFee");
// Schedule inspection (create inspection with payment)
exports.scheduleInspection = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { generatorId, scheduledDate, amount } = req.body;
        const owner = req.user?._id;
        if (!generatorId || !scheduledDate || !amount) {
            return next(new errorHandler_1.default("Generator ID, scheduled date, and amount are required", 400));
        }
        // Verify generator exists and belongs to user
        const generator = await Generator_1.Generator.findById(generatorId);
        if (!generator) {
            return next(new errorHandler_1.default("Generator not found", 404));
        }
        if (generator.owner.toString() !== owner?.toString()) {
            return next(new errorHandler_1.default("You don't have permission to schedule inspection for this generator", 403));
        }
        // Check for existing pending/scheduled inspections
        const existingInspection = await Inspection_1.Inspection.findOne({
            generator: generatorId,
            status: { $in: ["pending", "scheduled"] },
        });
        if (existingInspection) {
            return next(new errorHandler_1.default("There is already a pending or scheduled inspection for this generator", 400));
        }
        // Generate transaction reference
        const transactionReference = `TXN-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)
            .toUpperCase()}`;
        // Create payment record
        const payment = await Payment_1.Payment.create({
            user: owner,
            inspection: null,
            amount,
            transactionReference,
            status: "pending",
        });
        // Create inspection
        const inspection = await Inspection_1.Inspection.create({
            generator: generatorId,
            owner,
            scheduledDate: new Date(scheduledDate),
            payment: payment._id,
            location: generator.location,
        });
        // Update payment with inspection ID
        payment.inspection = inspection._id;
        await payment.save();
        // Update generator status
        generator.status = Generator_1.GeneratorStatus.UNDER_INSPECTION;
        await generator.save();
        const populatedInspection = await Inspection_1.Inspection.findById(inspection._id)
            .populate("generator", "generatorId brand model serialNumber")
            .populate("payment");
        res.status(201).json({
            success: true,
            message: "Inspection scheduled successfully. Please proceed to payment.",
            inspection: populatedInspection,
            paymentReference: transactionReference,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get inspection fees (admin-only)
exports.getInspectionFee = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        let fee = await InspectionFee_1.InspectionFee.findOne();
        // Create default fee if none exists
        if (!fee) {
            fee = await InspectionFee_1.InspectionFee.create({
                amount: 5000,
                description: "Standard inspection fee for all generator types",
            });
        }
        res.status(200).json({
            success: true,
            fee,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Update inspection fees (admin-only)
exports.updateInspectionFee = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { amount, description } = req.body;
        const updatedBy = req.user?._id;
        if (!amount || amount < 0) {
            return next(new errorHandler_1.default("Please provide a valid amount", 400));
        }
        let fee = await InspectionFee_1.InspectionFee.findOne();
        if (!fee) {
            // Create if doesn't exist
            fee = await InspectionFee_1.InspectionFee.create({
                amount,
                description: description || "Standard inspection fee for all generator types",
                updatedBy,
            });
        }
        else {
            // Update existing
            fee.amount = amount;
            if (description)
                fee.description = description;
            fee.updatedBy = updatedBy;
            await fee.save();
        }
        res.status(200).json({
            success: true,
            message: "Inspection fee updated successfully",
            fee,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get my inspections
exports.getMyInspections = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const owner = req.user?._id;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 10));
        const status = req.query.status;
        const skipAmount = (page - 1) * pageSize;
        const query = { owner };
        if (status && status !== "all") {
            query.status = status;
        }
        const [inspections, totalInspections] = await Promise.all([
            Inspection_1.Inspection.find(query)
                .populate("generator", "generatorId brand model serialNumber location")
                .populate("payment")
                .populate("inspector", "name email")
                .populate("report")
                .skip(skipAmount)
                .limit(pageSize)
                .sort({ createdAt: -1 })
                .lean(),
            Inspection_1.Inspection.countDocuments(query),
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
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get inspection by ID
exports.getInspectionById = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        const userRole = req.user?.role;
        const inspection = await Inspection_1.Inspection.findById(id)
            .populate("generator")
            .populate("owner", "name email companyName accountType phoneNumber")
            .populate("payment")
            .populate("inspector", "name email")
            .populate("report");
        if (!inspection) {
            return next(new errorHandler_1.default("Inspection not found", 404));
        }
        // Check permission
        if (userRole !== "admin" &&
            userRole !== "editor" &&
            inspection.owner._id.toString() !== userId?.toString()) {
            return next(new errorHandler_1.default("You don't have permission to view this inspection", 403));
        }
        res.status(200).json({
            success: true,
            inspection,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get all inspections --- for admin/editor
exports.getAllInspections = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
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
        // For search, we need to search in populated fields
        let inspections;
        let totalInspections;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
        if (search && search.trim()) {
            // First get generators matching the search
            const generators = await Generator_1.Generator.find({
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
            Inspection_1.Inspection.find(query)
                .populate("generator", "generatorId brand model serialNumber")
                .populate("owner", "name email companyName accountType")
                .populate("payment", "amount status transactionReference")
                .populate("inspector", "name email")
                .skip(skipAmount)
                .limit(pageSize)
                .sort(sortOptions)
                .lean(),
            Inspection_1.Inspection.countDocuments(query),
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
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Assign inspector to inspection --- for admin/editor
exports.assignInspector = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { inspectorId } = req.body;
        if (!inspectorId) {
            return next(new errorHandler_1.default("Inspector ID is required", 400));
        }
        // Verify inspector exists and has appropriate role
        const inspector = await User_1.User.findById(inspectorId);
        if (!inspector) {
            return next(new errorHandler_1.default("Inspector not found", 404));
        }
        if (inspector.role !== "admin" && inspector.role !== "editor") {
            return next(new errorHandler_1.default("Selected user is not an inspector", 400));
        }
        const inspection = await Inspection_1.Inspection.findById(id);
        if (!inspection) {
            return next(new errorHandler_1.default("Inspection not found", 404));
        }
        // Check if payment is completed
        const payment = await Payment_1.Payment.findById(inspection.payment);
        if (!payment || payment.status !== "paid") {
            return next(new errorHandler_1.default("Cannot assign inspector. Payment not completed", 400));
        }
        inspection.inspector = inspectorId;
        inspection.status = Inspection_1.InspectionStatus.SCHEDULED;
        await inspection.save();
        const updatedInspection = await Inspection_1.Inspection.findById(id)
            .populate("generator")
            .populate("owner", "name email companyName")
            .populate("inspector", "name email");
        res.status(200).json({
            success: true,
            message: "Inspector assigned successfully",
            inspection: updatedInspection,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Update inspection status --- for admin/editor
exports.updateInspectionStatus = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        if (!status) {
            return next(new errorHandler_1.default("Status is required", 400));
        }
        const inspection = await Inspection_1.Inspection.findById(id);
        if (!inspection) {
            return next(new errorHandler_1.default("Inspection not found", 404));
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
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Cancel inspection
exports.cancelInspection = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        const userRole = req.user?.role;
        const inspection = await Inspection_1.Inspection.findById(id);
        if (!inspection) {
            return next(new errorHandler_1.default("Inspection not found", 404));
        }
        // Check permission
        if (userRole !== "admin" &&
            inspection.owner.toString() !== userId?.toString()) {
            return next(new errorHandler_1.default("You don't have permission to cancel this inspection", 403));
        }
        if (inspection.status === "completed") {
            return next(new errorHandler_1.default("Cannot cancel completed inspection", 400));
        }
        inspection.status = Inspection_1.InspectionStatus.CANCELLED;
        await inspection.save();
        // Update generator status back to active
        await Generator_1.Generator.findByIdAndUpdate(inspection.generator, {
            status: "active",
        });
        res.status(200).json({
            success: true,
            message: "Inspection cancelled successfully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Delete inspection --- for admin only
exports.deleteInspection = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const inspection = await Inspection_1.Inspection.findById(id);
        if (!inspection) {
            return next(new errorHandler_1.default("Inspection not found", 404));
        }
        // Prevent deletion of completed inspections with reports
        if (inspection.status === "completed" && inspection.report) {
            return next(new errorHandler_1.default("Cannot delete completed inspection with an existing report", 400));
        }
        // Delete associated payment if it exists and is not paid
        if (inspection.payment) {
            const payment = await Payment_1.Payment.findById(inspection.payment);
            if (payment && payment.status !== "paid") {
                await Payment_1.Payment.findByIdAndDelete(inspection.payment);
            }
            else if (payment && payment.status === "paid") {
                return next(new errorHandler_1.default("Cannot delete inspection with completed payment. Consider cancelling instead.", 400));
            }
        }
        // Update generator status back to active if it's under inspection
        const generator = await Generator_1.Generator.findById(inspection.generator);
        if (generator && generator.status === Generator_1.GeneratorStatus.UNDER_INSPECTION) {
            generator.status = Generator_1.GeneratorStatus.ACTIVE;
            await generator.save();
        }
        // Delete the inspection
        await Inspection_1.Inspection.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Inspection deleted successfully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
