"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const authRouter = express_1.default.Router();
authRouter.post("/register", auth_controller_1.createUser);
authRouter.post("/user/activate", auth_controller_1.activateUser);
authRouter.post("/login", auth_controller_1.loginUser);
authRouter.get("/logout", auth_1.isAuthenticated, auth_controller_1.logoutUser);
authRouter.post("/password/forgot", auth_controller_1.forgotPassword);
authRouter.post("/password/reset", auth_controller_1.resetPassword);
authRouter.post("/token/refresh", auth_controller_1.refreshAccessToken);
exports.default = authRouter;
