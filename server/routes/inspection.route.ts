import express from "express";
import {
  authorizeRoles,
  isAuthenticated,
  requireActiveAccount,
} from "../middleware/auth";
import {
  assignInspector,
  cancelInspection,
  deleteInspection,
  allInspections,
  inspectionById,
  inspectionFee,
  myInspections,
  scheduleInspection,
  updateInspectionFee,
  updateInspectionStatus,
} from "../controllers/inspection.controller";
import { UserRole } from "../models/User";

const inspectionRouter = express.Router();

inspectionRouter.use(isAuthenticated, requireActiveAccount);

inspectionRouter.post("/inspection/schedule", scheduleInspection);
inspectionRouter.get("/inspections/me", myInspections);
inspectionRouter.get("/inspection/fee", inspectionFee);
inspectionRouter.get("/inspection/:id", inspectionById);
inspectionRouter.put(
  "/inspection/update/fee",
  authorizeRoles(UserRole.ADMIN),
  updateInspectionFee,
);
inspectionRouter.get(
  "/inspections",
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  allInspections,
);
inspectionRouter.put(
  "/inspector/assign/:id",
  authorizeRoles(UserRole.ADMIN),
  assignInspector,
);
inspectionRouter.put(
  "/inspection/update/status/:id",
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  updateInspectionStatus,
);

inspectionRouter.put("/inspection/cancel/:id", cancelInspection);

inspectionRouter.delete(
  "/inspection/delete/:id",
  authorizeRoles(UserRole.ADMIN),
  deleteInspection,
);

export default inspectionRouter;
