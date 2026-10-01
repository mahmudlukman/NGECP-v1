import express from "express";
import {
  authorizeRoles,
  isAuthenticated,
  requireActiveAccount,
} from "../middleware/auth";
import {
  deleteGenerator,
  allGenerators,
  generatorById,
  myGenerators,
  registerGenerator,
  updateGenerator,
  updateGeneratorStatus,
} from "../controllers/generator.controller";
import { UserRole } from "../models/User";

const generatorRouter = express.Router();

generatorRouter.use(isAuthenticated, requireActiveAccount);

generatorRouter.post("/generator/register", registerGenerator);
generatorRouter.get("/generator/:id", generatorById);
generatorRouter.get("/generators/me", myGenerators);
generatorRouter.get(
  "/generators",
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  allGenerators,
);
generatorRouter.put("/generator/update/:id", updateGenerator);
generatorRouter.put(
  "/generator/update/status/:id",
  authorizeRoles(UserRole.ADMIN, UserRole.EDITOR),
  updateGeneratorStatus,
);

generatorRouter.delete("/generator/delete/:id", deleteGenerator);

export default generatorRouter;
