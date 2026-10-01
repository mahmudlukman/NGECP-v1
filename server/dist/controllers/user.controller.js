"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserStatus = exports.individualUsers = exports.organizationUsers = exports.allUsers = exports.userById = exports.updateUserPassword = exports.updateUserProfile = exports.userInfo = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const User_1 = require("../models/User");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
// @desc    Get logged in user
// @route   GET /api/v1/me
// @access  Private
exports.userInfo = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    const user = await User_1.User.findById(req.user?._id);
    if (!user) {
        return next(new errorHandler_1.default("User doesn't exists", 400));
    }
    res.status(200).json({
        success: true,
        user,
    });
});
// @desc    Update user information
// @route   PUT /api/v1/update/user/profile
// @access  Private
exports.updateUserProfile = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    const userId = req.user?._id;
    const user = await User_1.User.findById(userId);
    if (!user) {
        return next(new errorHandler_1.default("User not found", 404));
    }
    const { name, phoneNumber, organizationName, organizationAddress, contactPersonName, contactPersonPhone, } = req.body;
    // Update fields based on account type
    if (user.accountType === User_1.AccountType.INDIVIDUAL) {
        if (name)
            user.name = name;
        if (phoneNumber)
            user.phoneNumber = phoneNumber;
    }
    else if (user.accountType === User_1.AccountType.ORGANIZATION) {
        if (organizationName)
            user.organizationName = organizationName;
        if (organizationAddress)
            user.organizationAddress = organizationAddress;
        if (contactPersonName)
            user.contactPersonName = contactPersonName;
        if (contactPersonPhone)
            user.contactPersonPhone = contactPersonPhone;
        if (phoneNumber)
            user.phoneNumber = phoneNumber;
    }
    await user.save();
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
    });
});
// @desc    Update user password
// @route   PUT /api/v1/update/user/password
// @access  Private
exports.updateUserPassword = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return next(new errorHandler_1.default("Please provide current and new password", 400));
    }
    if (newPassword.trim().length < 6 || newPassword.trim().length > 20) {
        return next(new errorHandler_1.default("Password must be between 6 and 20 characters", 400));
    }
    const user = await User_1.User.findById(req.user?._id).select("+password");
    if (!user) {
        return next(new errorHandler_1.default("User not found", 404));
    }
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
        return next(new errorHandler_1.default("Current password is incorrect", 400));
    }
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
        return next(new errorHandler_1.default("New password must be different from current password", 400));
    }
    user.password = newPassword.trim();
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});
// @desc    Get user by id
// @route   GET /api/v1/user/:id
// @access  Private
exports.userById = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    const user = await User_1.User.findById(req.params.id);
    if (!user) {
        return next(new errorHandler_1.default("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
});
// @desc    Get all users
// @route   GET /api/v1/users
// @access  Admin
exports.allUsers = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 10));
    const search = req.query.search;
    const role = req.query.role;
    const accountType = req.query.accountType;
    const isActiveParam = req.query.isActive;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const skipAmount = (page - 1) * pageSize;
    // Build dynamic query
    const query = {};
    // Add search functionality - updated for both individual and organization
    if (search && search.trim()) {
        query.$or = [
            { name: { $regex: search.trim(), $options: "i" } },
            { email: { $regex: search.trim(), $options: "i" } },
            { organizationName: { $regex: search.trim(), $options: "i" } },
            { contactPersonName: { $regex: search.trim(), $options: "i" } },
            { organizationRegNumber: { $regex: search.trim(), $options: "i" } },
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
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    // Execute queries in parallel for better performance
    const [users, totalUsers] = await Promise.all([
        User_1.User.find(query)
            .select("-password -refreshToken") // Exclude sensitive fields
            .skip(skipAmount)
            .limit(pageSize)
            .sort(sortOptions)
            .lean(), // Use lean() for better performance
        User_1.User.countDocuments(query),
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
});
// @desc    Get all organizational users
// @route   GET /api/v1/organization/users
// @access  Admin/Editor
exports.organizationUsers = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 10));
    const search = req.query.search;
    const skipAmount = (page - 1) * pageSize;
    const query = {
        accountType: User_1.AccountType.ORGANIZATION,
    };
    if (search && search.trim()) {
        query.$or = [
            { organizationName: { $regex: search.trim(), $options: "i" } },
            { organizationRegNumber: { $regex: search.trim(), $options: "i" } },
            { email: { $regex: search.trim(), $options: "i" } },
        ];
    }
    const [companies, totalCompanies] = await Promise.all([
        User_1.User.find(query)
            .select("-password")
            .skip(skipAmount)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .lean(),
        User_1.User.countDocuments(query),
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
});
// @desc    Get all individual users
// @route   GET /api/v1/individual/users
// @access  Admin/Editor
exports.individualUsers = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 10));
    const search = req.query.search;
    const skipAmount = (page - 1) * pageSize;
    const query = {
        accountType: User_1.AccountType.INDIVIDUAL,
    };
    if (search && search.trim()) {
        query.$or = [
            { name: { $regex: search.trim(), $options: "i" } },
            { email: { $regex: search.trim(), $options: "i" } },
        ];
    }
    const [individuals, totalIndividuals] = await Promise.all([
        User_1.User.find(query)
            .select("-password")
            .skip(skipAmount)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .lean(),
        User_1.User.countDocuments(query),
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
});
// @desc    Update user status
// @route   PUT /api/v1/user/update/user/status
// @access  Admin
exports.updateUserStatus = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    const { id, role, isActive } = req.body;
    if (!id) {
        return next(new errorHandler_1.default("User ID is required", 400));
    }
    const user = await User_1.User.findById(id);
    if (!user) {
        return next(new errorHandler_1.default(`User not found: ${id}`, 404));
    }
    // Prevent admin from deactivating themselves
    if (req.user?._id.toString() === id && isActive === false) {
        return next(new errorHandler_1.default("You cannot deactivate your own account", 400));
    }
    // Prevent changing own role
    if (req.user?._id.toString() === id && role && role !== user.role) {
        return next(new errorHandler_1.default("You cannot change your own role", 400));
    }
    const updateData = {};
    if (role !== undefined)
        updateData.role = role;
    if (isActive !== undefined)
        updateData.isActive = isActive;
    const updatedUser = await User_1.User.findByIdAndUpdate(id, updateData, {
        new: true,
    }).select("-password");
    res.status(200).json({
        success: true,
        message: "User status updated successfully",
        user: updatedUser,
    });
});
// @desc    Delete user
// @route   DELETE /api/v1/delete/user/:id
// @access  Admin
exports.deleteUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    const userId = req.params.id;
    // Prevent admin from deleting themselves
    if (req.user?._id?.toString() === userId) {
        return next(new errorHandler_1.default("You cannot delete your own account", 400));
    }
    const user = await User_1.User.findById(userId);
    if (!user) {
        return next(new errorHandler_1.default("User is not available with this id", 404));
    }
    await User_1.User.findByIdAndDelete(userId);
    res.status(200).json({
        success: true,
        message: "User deleted successfully!",
    });
});
