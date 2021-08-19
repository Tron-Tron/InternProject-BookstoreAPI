import express from "express";
import jwtAuth from "../../middleware/jwtAuth.js";
import {
  getAllRequirementByUserRole,
  acceptRoleStaff,
  rejectRoleStaff,
} from "./staffRequirementController.js";
import authorize from "../../middleware/authorize.js";
import staffRequirementValidate from "./staffRequirementValidate.js";
import validateMiddleware from "../commons/validateMiddleware.js";
import paginationValidate from "./../utils/paginationValidate.js";
const router = express.Router();
router.use(jwtAuth, authorize("admin", "manager"));
router.get(
  "/",
  validateMiddleware(paginationValidate.paging, "query"),
  getAllRequirementByUserRole
);
router.post(
  "/accept/:id",
  validateMiddleware(staffRequirementValidate.paramRequirement, "params"),
  acceptRoleStaff
);
router.delete(
  "/reject/:id",
  validateMiddleware(staffRequirementValidate.paramRequirement, "params"),
  rejectRoleStaff
);

export default router;
