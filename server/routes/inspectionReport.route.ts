import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import {
  createInspectionReport,
  getReportById,
  getReportByInspectionId,
  updateInspectionReport,
  approveInspectionReport,
  getAllReports,
  getMyReports,
  deleteInspectionReport,
} from "../controllers/inspectionReport.controller";

const InspectionReportRouter = express.Router();

// User routes
InspectionReportRouter.get("/my-reports", isAuthenticated, getMyReports);
InspectionReportRouter.get("/report/:id", isAuthenticated, getReportById);
InspectionReportRouter.get(
  "/inspection/:inspectionId",
  isAuthenticated,
  getReportByInspectionId
);

// Admin & Editor routes (can create and update reports)
InspectionReportRouter.post(
  "/create-report",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  createInspectionReport
);

InspectionReportRouter.put(
  "/update-inspection-report/:id",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  updateInspectionReport
);

InspectionReportRouter.get(
  "/get-all-reports",
  isAuthenticated,
  // authorizeRoles("admin", "editor"),
  getAllReports
);

// Admin only routes
InspectionReportRouter.put(
  "/approve-report/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  approveInspectionReport
);

InspectionReportRouter.delete(
  "/delete-report/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteInspectionReport
);

export default InspectionReportRouter;