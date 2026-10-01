import express from "express";
import { getDashboardAnalytics } from "../controllers/analytics.controller";
import {
  authorizeRoles,
  isAuthenticated,
  requireActiveAccount,
} from "../middleware/auth";
import { UserRole } from "../models/User";

const analyticsRouter = express.Router();

analyticsRouter.use(isAuthenticated, requireActiveAccount);

analyticsRouter.get(
  "/analytics",
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  getDashboardAnalytics,
);

export default analyticsRouter;
