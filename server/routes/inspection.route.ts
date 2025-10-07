import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  assignInspector,
  cancelInspection,
  getAllInspections,
  getInspectionById,
  getMyInspections,
  scheduleInspection,
  updateInspectionStatus,
} from "../controllers/inspection.controller";
const inspectionRouter = express.Router();

inspectionRouter.post("/schedule-inspection", scheduleInspection);
inspectionRouter.get("/my-inspections", isAuthenticated, getMyInspections);
inspectionRouter.get("/inspection/:id", isAuthenticated, getInspectionById);
inspectionRouter.get(
  "/get-all-inspections",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  getAllInspections
);
inspectionRouter.put("/assign-inspector/:id", assignInspector);
inspectionRouter.put("/update-inspector-status/:id", updateInspectionStatus);
inspectionRouter.put("/cancel-inspector/:id", cancelInspection);

export default inspectionRouter;
