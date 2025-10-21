"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const generator_controller_1 = require("../controllers/generator.controller");
const generatorRouter = express_1.default.Router();
generatorRouter.post("/register-generator", auth_1.isAuthenticated, generator_controller_1.registerGenerator);
generatorRouter.get("/generator/:id", auth_1.isAuthenticated, generator_controller_1.getGeneratorById);
generatorRouter.get("/my-generators", auth_1.isAuthenticated, generator_controller_1.getMyGenerators);
generatorRouter.get("/all-generators", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "editor"), generator_controller_1.getAllGenerators);
generatorRouter.put("/update-generator/:id", auth_1.isAuthenticated, generator_controller_1.updateGenerator);
generatorRouter.put("/update-generator-status/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "editor"), generator_controller_1.updateGeneratorStatus);
generatorRouter.delete("/delete-generator/:id", auth_1.isAuthenticated, generator_controller_1.deleteGenerator);
exports.default = generatorRouter;
