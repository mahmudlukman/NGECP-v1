import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  deleteGenerator,
  getAllGenerators,
  getGeneratorById,
  getMyGenerators,
  registerGenerator,
  updateGenerator,
  updateGeneratorStatus,
} from "../controllers/generator.controller";
const generatorRouter = express.Router();

generatorRouter.post("/register-generator", isAuthenticated, registerGenerator);
generatorRouter.get("/generator/:id", isAuthenticated, getGeneratorById);
generatorRouter.get("/my-generators", isAuthenticated, getMyGenerators);
generatorRouter.get(
  "/all-generators",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  getAllGenerators
);
generatorRouter.put("/update-generator/:id", isAuthenticated, updateGenerator);
generatorRouter.put(
  "/update-generator-status/:id",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  updateGeneratorStatus
);

generatorRouter.delete(
  "/delete-generator/:id",
  isAuthenticated,
  deleteGenerator
);

export default generatorRouter;
