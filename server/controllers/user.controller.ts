import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import { User, AccountType } from "../models/User";
import ErrorHandler from "../utils/errorHandler";
import { FilterQuery } from "mongoose";

// get user info
export const getUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user?._id);
      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user profile (for authenticated user)
export const updateUserProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const user = await User.findById(userId);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const {
        name,
        phoneNumber,
        companyName,
        companyAddress,
        contactPersonName,
        contactPersonPhone,
      } = req.body;

      // Update fields based on account type
      if (user.accountType === AccountType.INDIVIDUAL) {
        if (name) user.name = name;
        if (phoneNumber) user.phoneNumber = phoneNumber;
      } else if (user.accountType === AccountType.COMPANY) {
        if (companyName) user.companyName = companyName;
        if (companyAddress) user.companyAddress = companyAddress;
        if (contactPersonName) user.contactPersonName = contactPersonName;
        if (contactPersonPhone) user.contactPersonPhone = contactPersonPhone;
        if (phoneNumber) user.phoneNumber = phoneNumber;
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user password (for authenticated user)
export const updateUserPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return next(
          new ErrorHandler("Please provide current and new password", 400)
        );
      }

      if (newPassword.trim().length < 6 || newPassword.trim().length > 20) {
        return next(
          new ErrorHandler("Password must be between 6 and 20 characters", 400)
        );
      }

      const user = await User.findById(req.user?._id).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const isPasswordMatch = await user.comparePassword(currentPassword);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Current password is incorrect", 400));
      }

      const isSamePassword = await user.comparePassword(newPassword);
      if (isSamePassword) {
        return next(
          new ErrorHandler(
            "New password must be different from current password",
            400
          )
        );
      }

      user.password = newPassword.trim();
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// find user information by Id
export const getUserById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all users --- only for admin
export const getAllUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate query parameters
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.min(
        50,
        Math.max(1, parseInt(req.query.pageSize as string) || 10)
      );
      const search = req.query.search as string;
      const role = req.query.role as string;
      const accountType = req.query.accountType as string;
      const isActiveParam = req.query.isActive as string;
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

      const skipAmount = (page - 1) * pageSize;

      // Build dynamic query
      const query: FilterQuery<typeof User> = {};

      // Add search functionality - updated for both individual and company
      if (search && search.trim()) {
        query.$or = [
          { name: { $regex: search.trim(), $options: "i" } },
          { email: { $regex: search.trim(), $options: "i" } },
          { companyName: { $regex: search.trim(), $options: "i" } },
          { contactPersonName: { $regex: search.trim(), $options: "i" } },
          { companyRegNumber: { $regex: search.trim(), $options: "i" } },
        ];
      }

      // Filter by role
      if (role && role !== "all") {
        query.role = role;
      }

      // Filter by account type
      if (accountType && accountType !== "all") {
        query.accountType = accountType;
      }

      // Filter by active status
      if (isActiveParam && isActiveParam !== "all") {
        query.isActive = isActiveParam === "true";
      }

      // Build sort options
      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Execute queries in parallel for better performance
      const [users, totalUsers] = await Promise.all([
        User.find(query)
          .select("-password -refreshToken") // Exclude sensitive fields
          .skip(skipAmount)
          .limit(pageSize)
          .sort(sortOptions)
          .lean(), // Use lean() for better performance
        User.countDocuments(query),
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalUsers / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      // Handle edge case where page exceeds total pages
      if (page > totalPages && totalPages > 0) {
        return res.status(400).json({
          success: false,
          message: `Page ${page} exceeds total pages (${totalPages})`,
        });
      }

      res.status(200).json({
        success: true,
        users,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems: totalUsers,
          totalPages,
          hasNextPage,
          hasPrevPage,
          isNext: hasNextPage,
        },
        filters: {
          search: search || null,
          role: role || null,
          accountType: accountType || null,
          isActive: isActiveParam || null,
          sortBy,
          sortOrder,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get company users only --- for admin/editor
export const getOrganizationUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.min(
        50,
        Math.max(1, parseInt(req.query.pageSize as string) || 10)
      );
      const search = req.query.search as string;
      const skipAmount = (page - 1) * pageSize;

      const query: FilterQuery<typeof User> = {
        accountType: AccountType.COMPANY,
      };

      if (search && search.trim()) {
        query.$or = [
          { companyName: { $regex: search.trim(), $options: "i" } },
          { companyRegNumber: { $regex: search.trim(), $options: "i" } },
          { email: { $regex: search.trim(), $options: "i" } },
        ];
      }

      const [companies, totalCompanies] = await Promise.all([
        User.find(query)
          .select("-password")
          .skip(skipAmount)
          .limit(pageSize)
          .sort({ createdAt: -1 })
          .lean(),
        User.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCompanies / pageSize);

      res.status(200).json({
        success: true,
        companies,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems: totalCompanies,
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

// get individual users only --- for admin/editor
export const getIndividualUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.min(
        50,
        Math.max(1, parseInt(req.query.pageSize as string) || 10)
      );
      const search = req.query.search as string;
      const skipAmount = (page - 1) * pageSize;

      const query: FilterQuery<typeof User> = {
        accountType: AccountType.INDIVIDUAL,
      };

      if (search && search.trim()) {
        query.$or = [
          { name: { $regex: search.trim(), $options: "i" } },
          { email: { $regex: search.trim(), $options: "i" } },
        ];
      }

      const [individuals, totalIndividuals] = await Promise.all([
        User.find(query)
          .select("-password")
          .skip(skipAmount)
          .limit(pageSize)
          .sort({ createdAt: -1 })
          .lean(),
        User.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalIndividuals / pageSize);

      res.status(200).json({
        success: true,
        individuals,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems: totalIndividuals,
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

// update user role --- only for admin
export const updateUserStatus = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role, isActive } = req.body;

      if (!id) {
        return next(new ErrorHandler("User ID is required", 400));
      }

      const user = await User.findById(id);

      if (!user) {
        return next(new ErrorHandler(`User not found: ${id}`, 404));
      }

      // Prevent admin from deactivating themselves
      if (
        (req.user as { _id: string })?._id.toString() === id &&
        isActive === false
      ) {
        return next(
          new ErrorHandler("You cannot deactivate your own account", 400)
        );
      }

      // Prevent changing own role
      if (
        (req.user as { _id: string })?._id.toString() === id &&
        role &&
        role !== user.role
      ) {
        return next(new ErrorHandler("You cannot change your own role", 400));
      }

      const updateData: any = {};
      if (role !== undefined) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select("-password");

      res.status(200).json({
        success: true,
        message: "User status updated successfully",
        user: updatedUser,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete user --- only for admin
export const deleteUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;

      // Prevent admin from deleting themselves
      if ((req.user as { _id: string })?._id.toString() === userId) {
        return next(
          new ErrorHandler("You cannot delete your own account", 400)
        );
      }

      const user = await User.findById(userId);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 404)
        );
      }

      await User.findByIdAndDelete(userId);

      res.status(200).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
