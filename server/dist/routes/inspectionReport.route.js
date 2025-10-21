"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const inspectionReport_controller_1 = require("../controllers/inspectionReport.controller");
const InspectionReportRouter = express_1.default.Router();
// User routes
InspectionReportRouter.get("/my-reports", auth_1.isAuthenticated, inspectionReport_controller_1.getMyReports);
InspectionReportRouter.get("/report/:id", auth_1.isAuthenticated, inspectionReport_controller_1.getReportById);
InspectionReportRouter.get("/inspection/:inspectionId", auth_1.isAuthenticated, inspectionReport_controller_1.getReportByInspectionId);
// Admin & Editor routes (can create and update reports)
InspectionReportRouter.post("/create-report", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "editor"), inspectionReport_controller_1.createInspectionReport);
InspectionReportRouter.put("/update-inspection-report/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "editor"), inspectionReport_controller_1.updateInspectionReport);
InspectionReportRouter.get("/get-all-reports", auth_1.isAuthenticated, 
// authorizeRoles("admin", "editor"),
inspectionReport_controller_1.getAllReports);
// Admin only routes
InspectionReportRouter.put("/approve-report/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), inspectionReport_controller_1.approveInspectionReport);
InspectionReportRouter.delete("/delete-report/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), inspectionReport_controller_1.deleteInspectionReport);
exports.default = InspectionReportRouter;
