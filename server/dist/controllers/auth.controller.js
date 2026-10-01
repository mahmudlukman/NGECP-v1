"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.refreshAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.createActivationToken = exports.createUser = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const jwtToken_1 = require("../utils/jwtToken");
const config_1 = __importDefault(require("../config"));
const disposableDomains = [
    "tempmail.com",
    "throwaway.com",
    "throwawaymail.com",
    "guerrillamail.com",
    "mailinator.com",
    "10minutemail.com",
    "yopmail.com",
    "temp-mail.org",
    "trashmail.com",
    "dropmail.me",
];
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 20;
const isValidPasswordLength = (password) => password.length >= MIN_PASSWORD_LENGTH &&
    password.length <= MAX_PASSWORD_LENGTH;
// @desc       Create new individual or corporate user
// @route      POST /api/v1/register
// @access     Public
exports.createUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    const { email, password, accountType, name, phoneNumber, organizationName, organizationRegNumber, organizationAddress, contactPersonName, contactPersonPhone, } = req.body;
    if (!email || !password || !accountType) {
        return next(new errorHandler_1.default("Please provide email, password and account type", 400));
    }
    if (accountType !== User_1.AccountType.INDIVIDUAL &&
        accountType !== User_1.AccountType.ORGANIZATION) {
        return next(new errorHandler_1.default("Invalid account type", 400));
    }
    if (accountType === User_1.AccountType.INDIVIDUAL && (!name || !phoneNumber)) {
        return next(new errorHandler_1.default("Name and phone number are required for individual accounts", 400));
    }
    if (accountType === User_1.AccountType.ORGANIZATION &&
        (!organizationName || !phoneNumber)) {
        return next(new errorHandler_1.default("Organization name and phone number are required for Organization accounts", 400));
    }
    if (!isValidPasswordLength(password)) {
        return next(new errorHandler_1.default(`Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters!`, 400));
    }
    const emailLowerCase = email.toLowerCase().trim();
    const isEmailExist = await User_1.User.findOne({
        email: emailLowerCase,
    });
    if (isEmailExist) {
        return next(new errorHandler_1.default("Email already exist", 400));
    }
    const domain = emailLowerCase.split("@")[1];
    if (domain && disposableDomains.includes(domain)) {
        return next(new errorHandler_1.default("Please use a permanent email address", 400));
    }
    if (accountType === User_1.AccountType.ORGANIZATION && organizationRegNumber) {
        const isOrganizationRegExist = await User_1.User.findOne({
            organizationRegNumber,
        });
        if (isOrganizationRegExist) {
            return next(new errorHandler_1.default("organization registration number already exists", 400));
        }
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = {
        email: emailLowerCase,
        password: hashedPassword,
        accountType,
        ...(accountType === User_1.AccountType.INDIVIDUAL && {
            name,
            phoneNumber,
        }),
        ...(accountType === User_1.AccountType.ORGANIZATION && {
            organizationName,
            phoneNumber,
            organizationRegNumber,
            organizationAddress,
            contactPersonName,
            contactPersonPhone,
        }),
    };
    const activationToken = (0, exports.createActivationToken)(user);
    const activationUrl = `${config_1.default.FRONTEND_URL}/activation/${activationToken}`;
    const displayName = accountType === User_1.AccountType.INDIVIDUAL
        ? name
        : organizationName || contactPersonName;
    const data = {
        user: {
            name: displayName,
        },
        activationUrl,
    };
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
            ...(config_1.default.NODE_ENV !== "production" && {
                activationToken,
            }),
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(`Failed to send activation email: ${error.message}`, 400));
    }
});
// Signs the activation payload.
const createActivationToken = (user) => {
    return jsonwebtoken_1.default.sign({
        user,
        purpose: "activation",
    }, config_1.default.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};
exports.createActivationToken = createActivationToken;
// @desc       Activate new user
// @route      POST /api/user/activate
// @access     public
exports.activateUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    const { activation_token } = req.body;
    if (!activation_token) {
        return next(new errorHandler_1.default("Please provide activation token", 400));
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(activation_token, config_1.default.ACTIVATION_SECRET);
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new errorHandler_1.default("Activation link has expired. Please sign up again.", 400));
        }
        return next(new errorHandler_1.default("Invalid activation token", 400));
    }
    if (decoded.purpose !== "activation") {
        return next(new errorHandler_1.default("Invalid activation token", 400));
    }
    const { email, password, accountType, ...otherFields } = decoded.user;
    const existingUser = await User_1.User.findOne({
        email,
    });
    if (existingUser) {
        return next(new errorHandler_1.default("User already exist", 400));
    }
    const newUser = new User_1.User({
        email,
        password,
        accountType,
        ...otherFields,
    });
    newUser.$locals.skipHash = true;
    await newUser.save();
    try {
        const displayName = accountType === User_1.AccountType.INDIVIDUAL
            ? newUser.name
            : newUser.organizationName || newUser.contactPersonName;
        await (0, sendMail_1.default)({
            email: newUser.email,
            subject: "Welcome to NGECP 🎉",
            template: "welcome-mail.ejs",
            data: {
                user: {
                    name: displayName,
                },
                siteUrl: config_1.default.FRONTEND_URL,
            },
        });
    }
    catch (error) {
        console.error(`Failed to send welcome email to ${newUser.email}:`, error);
    }
    (0, jwtToken_1.sendToken)(newUser, 201, res);
});
// @desc       Login user
// @route      POST /api/login
// @access     public
exports.loginUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new errorHandler_1.default("Please enter email and password", 400));
    }
    const emailLowerCase = email.toLowerCase().trim();
    const user = await User_1.User.findOne({ email: emailLowerCase }).select("+password");
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
});
// @desc       Logout user
// @route      POST /api/logout
// @access     public
exports.logoutUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
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
});
// @desc       Refresh Access Token
// @route      POST /api/token/refresh
// @access     public
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
                organizationName: user.organizationName,
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
// @desc       Forgot password
// @route      POST /api/password/forgot
// @access     public
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
            : user.organizationName || user.contactPersonName;
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
// @desc       Reset password
// @route      POST /api/password/reset
// @access     public
exports.resetPassword = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
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
});
