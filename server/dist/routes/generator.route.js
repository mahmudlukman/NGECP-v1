"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const generator_controller_1 = require("../controllers/generator.controller");
const User_1 = require("../models/User");
const generatorRouter = express_1.default.Router();
generatorRouter.use(auth_1.isAuthenticated, auth_1.requireActiveAccount);
generatorRouter.post("/generator/register", generator_controller_1.registerGenerator);
generatorRouter.get("/generator/:id", generator_controller_1.generatorById);
generatorRouter.get("/generators/me", generator_controller_1.myGenerators);
generatorRouter.get("/generators", (0, auth_1.authorizeRoles)(User_1.UserRole.ADMIN, User_1.UserRole.EDITOR), generator_controller_1.allGenerators);
generatorRouter.put("/generator/update/:id", generator_controller_1.updateGenerator);
generatorRouter.put("/generator/update/status/:id", (0, auth_1.authorizeRoles)(User_1.UserRole.ADMIN, User_1.UserRole.EDITOR), generator_controller_1.updateGeneratorStatus);
generatorRouter.delete("/generator/delete/:id", generator_controller_1.deleteGenerator);
exports.default = generatorRouter;
