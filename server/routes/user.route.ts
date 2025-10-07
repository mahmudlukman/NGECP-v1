import express from "express";
import {
  deleteUser,
  getAllUsers,
  getIndividualUsers,
  getOrganizationUsers,
  getUserById,
  getUserInfo,
  updateUserPassword,
  updateUserProfile,
  updateUserStatus,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.get("/get-user/:id", getUserById);
userRouter.get(
  "/get-users",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  getAllUsers
);
userRouter.get(
  "/get-organization-users",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  getOrganizationUsers
);
userRouter.get(
  "/get-individual-users",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  getIndividualUsers
);
userRouter.put(
  "/update-user-status",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserStatus
);
userRouter.put(
  "/update-user-profile",
  isAuthenticated,
  updateUserProfile
);
userRouter.put(
  "/update-user-password",
  isAuthenticated,
  updateUserPassword
);

userRouter.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
