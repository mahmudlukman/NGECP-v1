import express from "express";
import { getDashboardAnalytics } from "../controllers/analytics.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const analyticsRouter = express.Router();

analyticsRouter.get(
  "/analytics",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  getDashboardAnalytics
);

export default analyticsRouter;
