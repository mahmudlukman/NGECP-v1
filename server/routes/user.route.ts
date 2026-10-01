import express from "express";
import {
  deleteUser,
  allUsers,
  individualUsers,
  organizationUsers,
  userById,
  userInfo,
  updateUserPassword,
  updateUserProfile,
  updateUserStatus,
} from "../controllers/user.controller";
import {
  authorizeRoles,
  isAuthenticated,
  requireActiveAccount,
} from "../middleware/auth";
import { UserRole } from "../models/User";

const userRouter = express.Router();

userRouter.use(isAuthenticated, requireActiveAccount);

userRouter.get("/me", userInfo);
userRouter.get("/user/:id", userById);
userRouter.get(
  "/users",
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  allUsers,
);
userRouter.get(
  "/organization/users",
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  organizationUsers,
);
userRouter.get(
  "/individual/users",
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  individualUsers,
);
userRouter.put(
  "/update/user/status",
  authorizeRoles(UserRole.ADMIN),
  updateUserStatus,
);
userRouter.put("/update/user/profile", updateUserProfile);
userRouter.put("/update/user/password", updateUserPassword);

userRouter.delete(
  "/delete/user/:id",
  authorizeRoles(UserRole.ADMIN),
  deleteUser,
);

export default userRouter;
