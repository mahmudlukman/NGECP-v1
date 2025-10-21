"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.refreshAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.createActivationToken = exports.createUser = void 0;
const User_1 = require("../models/User");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const jwtToken_1 = require("../utils/jwtToken");
const config_1 = __importDefault(require("../config"));
exports.createUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email, password, accountType, name, phoneNumber, companyName, companyRegNumber, companyAddress, contactPersonName, contactPersonPhone, } = req.body;
        // Validate required fields based on account type
        if (accountType === User_1.AccountType.INDIVIDUAL && (!name || !phoneNumber)) {
            return next(new errorHandler_1.default("Name and phone number are required for individual accounts", 400));
        }
        if (accountType === User_1.AccountType.COMPANY &&
            (!companyName || !phoneNumber)) {
            return next(new errorHandler_1.default("Company name and phone number are required for company accounts", 400));
        }
        // Normalize email to lowercase
        const emailLowerCase = email.toLowerCase().trim();
        const isEmailExist = await User_1.User.findOne({ email: emailLowerCase });
        if (isEmailExist) {
            return next(new errorHandler_1.default("Email already exist", 400));
        }
        // Check for duplicate company registration number
        if (accountType === User_1.AccountType.COMPANY && companyRegNumber) {
            const isCompanyRegExist = await User_1.User.findOne({ companyRegNumber });
            if (isCompanyRegExist) {
                return next(new errorHandler_1.default("Company registration number already exists", 400));
            }
        }
        const user = {
            email: emailLowerCase,
            password,
            accountType,
            ...(accountType === User_1.AccountType.INDIVIDUAL && { name, phoneNumber }),
            ...(accountType === User_1.AccountType.COMPANY && {
                companyName,
                phoneNumber,
                companyRegNumber,
                companyAddress,
                contactPersonName,
                contactPersonPhone,
            }),
        };
        const activationToken = (0, exports.createActivationToken)(user);
        const activationUrl = `${config_1.default.FRONTEND_URL}/activation/${activationToken}`;
        // Update email data to use correct name field
        const displayName = accountType === User_1.AccountType.INDIVIDUAL
            ? name
            : companyName || contactPersonName;
        const data = { user: { name: displayName }, activationUrl };
        try {
            await (0, sendMail_1.default)({
                email: user.email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data,
            });
            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account!`,
                activationToken: activationToken,
            });
        }
        catch (error) {
            return next(new errorHandler_1.default(`Failed to send activation email: ${error.message}`, 400));
        }
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Function to create an activation token
const createActivationToken = (user) => {
    const token = jsonwebtoken_1.default.sign({ user }, config_1.default.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
    return token;
};
exports.createActivationToken = createActivationToken;
exports.activateUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { activation_token } = req.body;
        if (!activation_token) {
            return next(new errorHandler_1.default("Please provide activation token", 400));
        }
        const newUser = jsonwebtoken_1.default.verify(activation_token, config_1.default.ACTIVATION_SECRET);
        if (!newUser) {
            return next(new errorHandler_1.default("Invalid token", 400));
        }
        const { email, password, accountType, ...otherFields } = newUser.user;
        let user = await User_1.User.findOne({ email });
        if (user) {
            return next(new errorHandler_1.default("User already exist", 400));
        }
        // Create user with all fields
        user = await User_1.User.create({
            email,
            password,
            accountType,
            ...otherFields,
        });
        res.status(201).json({
            success: true,
            message: "Email verified & user created successfully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
exports.loginUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandler_1.default("Please enter email and password", 400));
        }
        const user = await User_1.User.findOne({ email }).select("+password");
        if (!user) {
            return next(new errorHandler_1.default("Invalid credentials", 400));
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new errorHandler_1.default("Invalid credentials", 400));
        }
        const { isActive } = user;
        if (!isActive) {
            return next(new errorHandler_1.default("This account has been suspended! Try to contact the admin", 403));
        }
        (0, jwtToken_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
exports.logoutUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        // Clear both tokens
        res.cookie("access_token", "", {
            maxAge: 1,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.cookie("refresh_token", "", {
            maxAge: 1,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// ============================================
// REFRESH ACCESS TOKEN
// ============================================
exports.refreshAccessToken = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return next(new errorHandler_1.default("Please login to access this resource", 401));
        }
        const decoded = jsonwebtoken_1.default.verify(refresh_token, config_1.default.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return next(new errorHandler_1.default("Invalid refresh token", 401));
        }
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        if (!user.isActive) {
            return next(new errorHandler_1.default("This account has been suspended! Try to contact the admin", 403));
        }
        const newAccessToken = user.getJwtToken();
        const newRefreshToken = user.getRefreshToken();
        res.cookie("access_token", newAccessToken, jwtToken_1.accessTokenOptions);
        res.cookie("refresh_token", newRefreshToken, jwtToken_1.refreshTokenOptions);
        // Update response to include correct user fields
        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                accountType: user.accountType,
                name: user.name,
                companyName: user.companyName,
                isActive: user.isActive,
            },
        });
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new errorHandler_1.default("Refresh token expired. Please login again", 401));
        }
        if (error.name === "JsonWebTokenError") {
            return next(new errorHandler_1.default("Invalid refresh token", 401));
        }
        return next(new errorHandler_1.default("Could not refresh token", 401));
    }
});
exports.forgotPassword = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return next(new errorHandler_1.default("Please provide a valid email!", 400));
        }
        const emailLowerCase = email.toLowerCase();
        const user = await User_1.User.findOne({ email: emailLowerCase });
        if (!user) {
            return next(new errorHandler_1.default("User not found, invalid request!", 400));
        }
        const { isActive } = user;
        if (!isActive) {
            return next(new errorHandler_1.default("This account has been suspended! Try to contact the admin", 403));
        }
        const resetToken = (0, exports.createActivationToken)(user);
        const resetUrl = `${config_1.default.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;
        // Use correct name field based on account type
        const displayName = user.accountType === User_1.AccountType.INDIVIDUAL
            ? user.name
            : user.companyName || user.contactPersonName;
        const data = { user: { name: displayName }, resetUrl };
        try {
            await (0, sendMail_1.default)({
                email: user.email,
                subject: "Reset your password",
                template: "forgot-password-mail.ejs",
                data,
            });
            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to reset your password!`,
                resetToken: resetToken,
            });
        }
        catch (error) {
            return next(new errorHandler_1.default(error.message, 400));
        }
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// reset password
exports.resetPassword = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { newPassword } = req.body;
        const { id } = req.query;
        if (!id) {
            return next(new errorHandler_1.default("No user ID provided!", 400));
        }
        const user = await User_1.User.findById(id).select("+password");
        if (!user) {
            return next(new errorHandler_1.default("user not found!", 400));
        }
        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword)
            return next(new errorHandler_1.default("New password must be different from the previous one!", 400));
        if (newPassword.trim().length < 6 || newPassword.trim().length > 20) {
            return next(new errorHandler_1.default("Password must be between at least 6 characters!", 400));
        }
        user.password = newPassword.trim();
        await user.save();
        res.status(201).json({
            success: true,
            message: `Password Reset Successfully', 'Now you can login with new password!`,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
