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
authRouter.post("/user/activate", activateUser);
authRouter.post("/login", loginUser);
authRouter.get("/logout", isAuthenticated, logoutUser);
authRouter.post("/password/forgot", forgotPassword);
authRouter.post(
  "/password/reset",
  resetPassword
);
authRouter.post("/token/refresh", refreshAccessToken);

export default authRouter;
