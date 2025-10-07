import express from "express";
import {
  activateUser,
  forgotPassword,
  loginUser,
  logoutUser,
  resetPassword,
  createUser,
  refreshAccessToken,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/auth";
const authRouter = express.Router();

authRouter.post("/register", createUser);
authRouter.post("/activate-user", activateUser);
authRouter.post("/login", loginUser);
authRouter.get("/logout", isAuthenticated, logoutUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post(
  "/reset-password",
  resetPassword
);
authRouter.post("/refresh-token", refreshAccessToken);

export default authRouter;
