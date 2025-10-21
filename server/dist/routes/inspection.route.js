"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const inspection_controller_1 = require("../controllers/inspection.controller");
const inspectionRouter = express_1.default.Router();
inspectionRouter.post("/schedule-inspection", auth_1.isAuthenticated, inspection_controller_1.scheduleInspection);
inspectionRouter.get("/my-inspections", auth_1.isAuthenticated, inspection_controller_1.getMyInspections);
inspectionRouter.get("/inspection/:id", auth_1.isAuthenticated, inspection_controller_1.getInspectionById);
inspectionRouter.get("/inspection-fee", auth_1.isAuthenticated, inspection_controller_1.getInspectionFee);
inspectionRouter.put("/update-inspection-fee", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), inspection_controller_1.updateInspectionFee);
inspectionRouter.get("/all-inspections", auth_1.isAuthenticated, 
// authorizeRoles("admin", "editor"),
inspection_controller_1.getAllInspections);
inspectionRouter.put("/assign-inspector/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), inspection_controller_1.assignInspector);
inspectionRouter.put("/update-inspection-status/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "editor"), inspection_controller_1.updateInspectionStatus);
inspectionRouter.put("/cancel-inspection/:id", auth_1.isAuthenticated, inspection_controller_1.cancelInspection);
inspectionRouter.delete("/delete-inspection/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), inspection_controller_1.deleteInspection);
exports.default = inspectionRouter;
