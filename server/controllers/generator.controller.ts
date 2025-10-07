import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import { Generator, IGenerator } from "../models/Generator";
import ErrorHandler from "../utils/errorHandler";
import { FilterQuery } from "mongoose";

// Register a new generator
export const registerGenerator = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        brand,
        model,
        serialNumber,
        capacity,
        yearOfManufacture,
        fuelType,
        location,
      } = req.body;

      const owner = req.user?._id;

      if (!owner) {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      // Check if serial number already exists
      const existingGenerator = await Generator.findOne({ serialNumber });
      if (existingGenerator) {
        return next(
          new ErrorHandler(
            "Generator with this serial number already registered",
            400
          )
        );
      }

      // Check if user already registered this generator (by owner + serialNumber)
      const userGenerator = await Generator.findOne({ owner, serialNumber });
      if (userGenerator) {
        return next(
          new ErrorHandler(
            "You have already registered a generator with this serial number",
            400
          )
        );
      }

      // Generate unique generator ID
      const generatorCount = await Generator.countDocuments();
      const generatorId = `GEN-${Date.now()}-${generatorCount + 1}`;

      const generator = await Generator.create({
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get all generators for authenticated user
export const getMyGenerators = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const owner = req.user?._id;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.min(
        50,
        Math.max(1, parseInt(req.query.pageSize as string) || 10)
      );
      const status = req.query.status as string;
      const search = req.query.search as string;

      const skipAmount = (page - 1) * pageSize;

      const query: FilterQuery<IGenerator> = { owner };

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
        Generator.find(query)
          .skip(skipAmount)
          .limit(pageSize)
          .sort({ createdAt: -1 })
          .lean(),
        Generator.countDocuments(query),
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get single generator by ID
export const getGeneratorById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;
      const userRole = req.user?.role;

      const generator = await Generator.findById(id).populate(
        "owner",
        "name email companyName accountType"
      );

      if (!generator) {
        return next(new ErrorHandler("Generator not found", 404));
      }

      // Check if user has permission to view this generator
      if (
        userRole !== "admin" &&
        userRole !== "editor" &&
        generator.owner._id.toString() !== userId?.toString()
      ) {
        return next(
          new ErrorHandler("You don't have permission to view this generator", 403)
        );
      }

      res.status(200).json({
        success: true,
        generator,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update generator details
export const updateGenerator = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;
      const userRole = req.user?.role;

      const generator = await Generator.findById(id);

      if (!generator) {
        return next(new ErrorHandler("Generator not found", 404));
      }

      // Check ownership
      if (
        userRole !== "admin" &&
        generator.owner.toString() !== userId?.toString()
      ) {
        return next(
          new ErrorHandler("You don't have permission to update this generator", 403)
        );
      }

      const {
        brand,
        model,
        capacity,
        yearOfManufacture,
        fuelType,
        location,
        status,
      } = req.body;

      // Update allowed fields
      if (brand) generator.brand = brand;
      if (model) generator.model = model;
      if (capacity) generator.capacity = capacity;
      if (yearOfManufacture) generator.yearOfManufacture = yearOfManufacture;
      if (fuelType) generator.fuelType = fuelType;
      if (location) generator.location = location;

      // Only admin can update status
      if (status && userRole === "admin") {
        generator.status = status;
      }

      await generator.save();

      res.status(200).json({
        success: true,
        message: "Generator updated successfully",
        generator,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete generator
export const deleteGenerator = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;
      const userRole = req.user?.role;

      const generator = await Generator.findById(id);

      if (!generator) {
        return next(new ErrorHandler("Generator not found", 404));
      }

      // Check ownership
      if (
        userRole !== "admin" &&
        generator.owner.toString() !== userId?.toString()
      ) {
        return next(
          new ErrorHandler("You don't have permission to delete this generator", 403)
        );
      }

      await Generator.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Generator deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get all generators --- for admin/editor
export const getAllGenerators = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.min(
        50,
        Math.max(1, parseInt(req.query.pageSize as string) || 10)
      );
      const status = req.query.status as string;
      const search = req.query.search as string;
      const state = req.query.state as string;
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

      const skipAmount = (page - 1) * pageSize;

      const query: FilterQuery<IGenerator> = {};

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

      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

      const [generators, totalGenerators] = await Promise.all([
        Generator.find(query)
          .populate("owner", "name email companyName accountType")
          .skip(skipAmount)
          .limit(pageSize)
          .sort(sortOptions)
          .lean(),
        Generator.countDocuments(query),
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get generator statistics --- for admin/editor
export const getGeneratorStatistics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [
        totalGenerators,
        activeGenerators,
        inactiveGenerators,
        underInspection,
        compliantGenerators,
        nonCompliantGenerators,
        avgComplianceScore,
      ] = await Promise.all([
        Generator.countDocuments(),
        Generator.countDocuments({ status: "active" }),
        Generator.countDocuments({ status: "inactive" }),
        Generator.countDocuments({ status: "under_inspection" }),
        Generator.countDocuments({ status: "compliant" }),
        Generator.countDocuments({ status: "non_compliant" }),
        Generator.aggregate([
          { $match: { complianceScore: { $exists: true } } },
          { $group: { _id: null, avgScore: { $avg: "$complianceScore" } } },
        ]),
      ]);

      // Get generators by state
      const generatorsByState = await Generator.aggregate([
        { $group: { _id: "$location.state", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Get generators by fuel type
      const generatorsByFuelType = await Generator.aggregate([
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
          averageComplianceScore:
            avgComplianceScore.length > 0
              ? Math.round(avgComplianceScore[0].avgScore * 100) / 100
              : 0,
          byState: generatorsByState,
          byFuelType: generatorsByFuelType,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update generator status --- admin only
export const updateGeneratorStatus = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, complianceScore } = req.body;

      if (!status) {
        return next(new ErrorHandler("Status is required", 400));
      }

      const generator = await Generator.findById(id);

      if (!generator) {
        return next(new ErrorHandler("Generator not found", 404));
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);