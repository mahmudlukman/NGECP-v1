"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
const config_1 = __importDefault(require("../config"));
// Parse environment variables
const accessTokenExpire = parseInt(config_1.default.JWT_EXPIRES || "15", 10); // minutes
const refreshTokenExpire = parseInt(config_1.default.REFRESH_TOKEN_EXPIRES || "7", 10); // days
const isProduction = config_1.default.NODE_ENV === "production";
// Access token options (short-lived)
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 1000), // minutes to ms
    maxAge: accessTokenExpire * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
};
// Refresh token options (long-lived)
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // days to ms
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
};
// Send both tokens
const sendToken = (user, statusCode, res) => {
    const accessToken = user.getJwtToken();
    const refreshToken = user.getRefreshToken();
    // Set both cookies
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};
exports.sendToken = sendToken;
