"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const userRouter = express_1.default.Router();
userRouter.get("/me", auth_1.isAuthenticated, user_controller_1.getUserInfo);
userRouter.get("/get-user/:id", user_controller_1.getUserById);
userRouter.get("/get-users", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "editor"), user_controller_1.getAllUsers);
userRouter.get("/get-organization-users", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "editor"), user_controller_1.getOrganizationUsers);
userRouter.get("/get-individual-users", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "editor"), user_controller_1.getIndividualUsers);
userRouter.put("/update-user-status", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), user_controller_1.updateUserStatus);
userRouter.put("/update-user-profile", auth_1.isAuthenticated, user_controller_1.updateUserProfile);
userRouter.put("/update-user-password", auth_1.isAuthenticated, user_controller_1.updateUserPassword);
userRouter.delete("/delete-user/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), user_controller_1.deleteUser);
exports.default = userRouter;
