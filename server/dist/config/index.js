"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV,
    WHITELIST_ORIGINS: ["http://localhost:5173"],
    FRONTEND_URL: process.env.FRONTEND_URL,
    DB_URL: process.env.DB_URL,
    ACTIVATION_SECRET: process.env.ACTIVATION_SECRET,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    JWT_EXPIRES: process.env.JWT_EXPIRES,
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES,
    defaultResLimit: 20,
    defaultResOffset: 0,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY,
    FLW_SECRET_KEY: process.env.FLW_SECRET_KEY,
    FLW_ENCRYPTION_KEY: process.env.FLW_ENCRYPTION_KEY,
    FLW_WEBHOOK_HASH: process.env.FLW_WEBHOOK_HASH,
};
exports.default = config;
