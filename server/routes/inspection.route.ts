import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  assignInspector,
  cancelInspection,
  getAllInspections,
  getInspectionById,
  getInspectionFees,
  getMyInspections,
  scheduleInspection,
  updateInspectionFees,
  updateInspectionStatus,
} from "../controllers/inspection.controller";
const inspectionRouter = express.Router();

inspectionRouter.post(
  "/schedule-inspection",
  isAuthenticated,
  scheduleInspection
);
inspectionRouter.get("/my-inspections", isAuthenticated, getMyInspections);
inspectionRouter.get("/inspection/:id", isAuthenticated, getInspectionById);
inspectionRouter.get(
  "/inspection-fee",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  getInspectionFees
);
inspectionRouter.put(
  "/update-inspection-fee",
  isAuthenticated,
  authorizeRoles("admin"),
  updateInspectionFees
);
inspectionRouter.get(
  "/all-inspections",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  getAllInspections
);
inspectionRouter.put(
  "/assign-inspector/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  assignInspector
);
inspectionRouter.put(
  "/update-inspector-status/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateInspectionStatus
);

inspectionRouter.put(
  "/cancel-inspector/:id",
  isAuthenticated,
  cancelInspection
);

export default inspectionRouter;
