"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = require("express-rate-limit");
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: (req) => (req.user ? 1000 : 100),
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        status: 429,
        error: "Too many requests, please try again later.",
    },
});
exports.default = limiter;
