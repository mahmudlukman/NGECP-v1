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

generatorRouter.post("/register-generator", registerGenerator);
generatorRouter.get("/generator/:id", isAuthenticated, getGeneratorById);
generatorRouter.get("/my-generators", isAuthenticated, getMyGenerators);
generatorRouter.get(
  "/my-generators",
  isAuthenticated,
  authorizeRoles("admin", "editor"),
  getAllGenerators
);
generatorRouter.put("/update-generator/:id", updateGenerator);
generatorRouter.put("/update-generator-status/:id", updateGeneratorStatus);
generatorRouter.delete("/delete-generator/:id", deleteGenerator);

export default generatorRouter;
