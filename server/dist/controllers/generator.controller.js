"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGeneratorStatus = exports.getGeneratorStatistics = exports.getAllGenerators = exports.deleteGenerator = exports.updateGenerator = exports.getGeneratorById = exports.getMyGenerators = exports.registerGenerator = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const Generator_1 = require("../models/Generator");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
// Register a new generator
exports.registerGenerator = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { brand, model, serialNumber, capacity, yearOfManufacture, fuelType, location, } = req.body;
        const owner = req.user?._id;
        if (!owner) {
            return next(new errorHandler_1.default("User not authenticated", 401));
        }
        // Check if serial number already exists
        const existingGenerator = await Generator_1.Generator.findOne({ serialNumber });
        if (existingGenerator) {
            return next(new errorHandler_1.default("Generator with this serial number already registered", 400));
        }
        // Check if user already registered this generator (by owner + serialNumber)
        const userGenerator = await Generator_1.Generator.findOne({ owner, serialNumber });
        if (userGenerator) {
            return next(new errorHandler_1.default("You have already registered a generator with this serial number", 400));
        }
        // Generate unique generator ID
        const generatorCount = await Generator_1.Generator.countDocuments();
        const generatorId = `GEN-${Date.now()}-${generatorCount + 1}`;
        const generator = await Generator_1.Generator.create({
            owner,
            generatorId,
            brand,
            model,
            serialNumber,
            capacity,
            yearOfManufacture,
            fuelType,
            location,
        });
        res.status(201).json({
            success: true,
            message: "Generator registered successfully",
            generator,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get all generators for authenticated user
exports.getMyGenerators = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const owner = req.user?._id;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 10));
        const status = req.query.status;
        const search = req.query.search;
        const skipAmount = (page - 1) * pageSize;
        const query = { owner };
        if (status && status !== "all") {
            query.status = status;
        }
        if (search && search.trim()) {
            query.$or = [
                { generatorId: { $regex: search.trim(), $options: "i" } },
                { brand: { $regex: search.trim(), $options: "i" } },
                { model: { $regex: search.trim(), $options: "i" } },
                { serialNumber: { $regex: search.trim(), $options: "i" } },
            ];
        }
        const [generators, totalGenerators] = await Promise.all([
            Generator_1.Generator.find(query)
                .skip(skipAmount)
                .limit(pageSize)
                .sort({ createdAt: -1 })
                .lean(),
            Generator_1.Generator.countDocuments(query),
        ]);
        const totalPages = Math.ceil(totalGenerators / pageSize);
        res.status(200).json({
            success: true,
            generators,
            pagination: {
                currentPage: page,
                pageSize,
                totalItems: totalGenerators,
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
// Get single generator by ID
exports.getGeneratorById = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        // const userId = req.user?._id;
        // const userRole = req.user?.role;
        const generator = await Generator_1.Generator.findById(id).populate("owner", "name email companyName accountType");
        if (!generator) {
            return next(new errorHandler_1.default("Generator not found", 404));
        }
        // Check if user has permission to view this generator
        // if (
        //   userRole !== "admin" &&
        //   userRole !== "editor" &&
        //   generator.owner._id.toString() !== userId?.toString()
        // ) {
        //   return next(
        //     new ErrorHandler("You don't have permission to view this generator", 403)
        //   );
        // }
        res.status(200).json({
            success: true,
            generator,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Update generator details
exports.updateGenerator = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        const generator = await Generator_1.Generator.findById(id);
        if (!generator) {
            return next(new errorHandler_1.default("Generator not found", 404));
        }
        // Check ownership
        if (generator.owner.toString() !== userId?.toString()) {
            return next(new errorHandler_1.default("You don't have permission to update this generator", 403));
        }
        const { brand, model, capacity, yearOfManufacture, fuelType, location, } = req.body;
        // Update allowed fields
        if (brand)
            generator.brand = brand;
        if (model)
            generator.model = model;
        if (capacity)
            generator.capacity = capacity;
        if (yearOfManufacture)
            generator.yearOfManufacture = yearOfManufacture;
        if (fuelType)
            generator.fuelType = fuelType;
        if (location)
            generator.location = location;
        await generator.save();
        res.status(200).json({
            success: true,
            message: "Generator updated successfully",
            generator,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Delete generator
exports.deleteGenerator = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        const userRole = req.user?.role;
        const generator = await Generator_1.Generator.findById(id);
        if (!generator) {
            return next(new errorHandler_1.default("Generator not found", 404));
        }
        // Check ownership
        if (userRole !== "admin" &&
            generator.owner.toString() !== userId?.toString()) {
            return next(new errorHandler_1.default("You don't have permission to delete this generator", 403));
        }
        await Generator_1.Generator.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Generator deleted successfully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Get all generators --- for admin/editor
exports.getAllGenerators = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 10));
        const status = req.query.status;
        const search = req.query.search;
        const state = req.query.state;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";
        const skipAmount = (page - 1) * pageSize;
        const query = {};
        if (status && status !== "all") {
            query.status = status;
        }
        if (state && state !== "all") {
            query["location.state"] = state;
        }
        if (search && search.trim()) {
            query.$or = [
                { generatorId: { $regex: search.trim(), $options: "i" } },
                { brand: { $regex: search.trim(), $options: "i" } },
                { model: { $regex: search.trim(), $options: "i" } },
                { serialNumber: { $regex: search.trim(), $options: "i" } },
            ];
        }
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
        const [generators, totalGenerators] = await Promise.all([
            Generator_1.Generator.find(query)
                .populate("owner", "name email companyName accountType")
                .skip(skipAmount)
                .limit(pageSize)
                .sort(sortOptions)
                .lean(),
            Generator_1.Generator.countDocuments(query),
        ]);
        const totalPages = Math.ceil(totalGenerators / pageSize);
        res.status(200).json({
            success: true,
            generators,
            pagination: {
                currentPage: page,
                pageSize,
                totalItems: totalGenerators,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            filters: {
                status: status || null,
                state: state || null,
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
// Get generator statistics --- for admin/editor
exports.getGeneratorStatistics = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const [totalGenerators, activeGenerators, inactiveGenerators, underInspection, compliantGenerators, nonCompliantGenerators, avgComplianceScore,] = await Promise.all([
            Generator_1.Generator.countDocuments(),
            Generator_1.Generator.countDocuments({ status: "active" }),
            Generator_1.Generator.countDocuments({ status: "inactive" }),
            Generator_1.Generator.countDocuments({ status: "under_inspection" }),
            Generator_1.Generator.countDocuments({ status: "compliant" }),
            Generator_1.Generator.countDocuments({ status: "non_compliant" }),
            Generator_1.Generator.aggregate([
                { $match: { complianceScore: { $exists: true } } },
                { $group: { _id: null, avgScore: { $avg: "$complianceScore" } } },
            ]),
        ]);
        // Get generators by state
        const generatorsByState = await Generator_1.Generator.aggregate([
            { $group: { _id: "$location.state", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        // Get generators by fuel type
        const generatorsByFuelType = await Generator_1.Generator.aggregate([
            { $group: { _id: "$fuelType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        res.status(200).json({
            success: true,
            statistics: {
                total: totalGenerators,
                byStatus: {
                    active: activeGenerators,
                    inactive: inactiveGenerators,
                    underInspection,
                    compliant: compliantGenerators,
                    nonCompliant: nonCompliantGenerators,
                },
                averageComplianceScore: avgComplianceScore.length > 0
                    ? Math.round(avgComplianceScore[0].avgScore * 100) / 100
                    : 0,
                byState: generatorsByState,
                byFuelType: generatorsByFuelType,
            },
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Update generator status --- admin only
exports.updateGeneratorStatus = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, complianceScore } = req.body;
        if (!status) {
            return next(new errorHandler_1.default("Status is required", 400));
        }
        const generator = await Generator_1.Generator.findById(id);
        if (!generator) {
            return next(new errorHandler_1.default("Generator not found", 404));
        }
        generator.status = status;
        if (complianceScore !== undefined) {
            generator.complianceScore = complianceScore;
        }
        await generator.save();
        res.status(200).json({
            success: true,
            message: "Generator status updated successfully",
            generator,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
