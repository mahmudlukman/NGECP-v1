"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const inspectionReport_controller_1 = require("../controllers/inspectionReport.controller");
const User_1 = require("../models/User");
const InspectionReportRouter = express_1.default.Router();
InspectionReportRouter.use(auth_1.isAuthenticated, auth_1.requireActiveAccount);
// User routes
InspectionReportRouter.get("/reports/me", inspectionReport_controller_1.myReports);
InspectionReportRouter.get("/report/:id", inspectionReport_controller_1.reportById);
InspectionReportRouter.get("/report/:inspectionId", inspectionReport_controller_1.reportByInspectionId);
// Admin & Editor routes (can create and update reports)
InspectionReportRouter.post("/report/create", (0, auth_1.authorizeRoles)(User_1.UserRole.ADMIN, User_1.UserRole.EDITOR), inspectionReport_controller_1.createInspectionReport);
InspectionReportRouter.put("/report/inspection/update/:id", (0, auth_1.authorizeRoles)(User_1.UserRole.ADMIN, User_1.UserRole.EDITOR), inspectionReport_controller_1.updateInspectionReport);
InspectionReportRouter.get("/reports", (0, auth_1.authorizeRoles)(User_1.UserRole.ADMIN, User_1.UserRole.EDITOR), inspectionReport_controller_1.allReports);
// Admin only routes
InspectionReportRouter.put("/report/approve/:id", (0, auth_1.authorizeRoles)(User_1.UserRole.ADMIN), inspectionReport_controller_1.approveInspectionReport);
InspectionReportRouter.delete("/report/delete/:id", (0, auth_1.authorizeRoles)(User_1.UserRole.ADMIN), inspectionReport_controller_1.deleteInspectionReport);
exports.default = InspectionReportRouter;
