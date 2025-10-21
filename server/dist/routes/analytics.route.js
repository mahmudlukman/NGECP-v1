"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_1 = require("../middleware/auth");
const analyticsRouter = express_1.default.Router();
analyticsRouter.get("/analytics", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "editor"), analytics_controller_1.getDashboardAnalytics);
exports.default = analyticsRouter;
