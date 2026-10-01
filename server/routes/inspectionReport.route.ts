import express from "express";
import {
  isAuthenticated,
  authorizeRoles,
  requireActiveAccount,
} from "../middleware/auth";
import {
  createInspectionReport,
  reportById,
  reportByInspectionId,
  updateInspectionReport,
  approveInspectionReport,
  allReports,
  myReports,
  deleteInspectionReport,
} from "../controllers/inspectionReport.controller";
import { UserRole } from "../models/User";

const InspectionReportRouter = express.Router();

InspectionReportRouter.use(isAuthenticated, requireActiveAccount);

// User routes
InspectionReportRouter.get("/reports/me", myReports);
InspectionReportRouter.get("/report/:id", reportById);
InspectionReportRouter.get("/report/:inspectionId", reportByInspectionId);

// Admin & Editor routes (can create and update reports)
InspectionReportRouter.post(
  "/report/create",
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  createInspectionReport,
);

InspectionReportRouter.put(
  "/report/inspection/update/:id",
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  updateInspectionReport,
);

InspectionReportRouter.get(
  "/reports",
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  allReports,
);

// Admin only routes
InspectionReportRouter.put(
  "/report/approve/:id",
  authorizeRoles(UserRole.ADMIN),
  approveInspectionReport,
);

InspectionReportRouter.delete(
  "/report/delete/:id",
  authorizeRoles(UserRole.ADMIN),
  deleteInspectionReport,
);

export default InspectionReportRouter;
