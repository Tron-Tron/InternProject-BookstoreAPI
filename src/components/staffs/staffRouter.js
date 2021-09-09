import express from "express";
import authorize from "../../middleware/authorize.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import upload from "../commons/upload.js";
import paginationValidate from "./../utils/paginationValidate.js";
import validateMiddleware from "../commons/validateMiddleware.js";
import staffValidate from "./staffValidate.js";
import {
  registerStaff,
  updateProfileStaff,
  getProfile,
  getStaffById,
  updateStaffById,
  getAllStaffStore,
  deleteStaff,
} from "./staffController.js";
const router = express.Router();
router.use(jwtAuth);
router.post(
  "/",
  authorize("manager"),
  validateMiddleware(staffValidate.registerStaff, "body"),
  registerStaff
);
router.get(
  "/all",
  authorize("manager", "shipper", "officer"),
  getAllStaffStore
);
router.get("/:staffId", authorize("manager"), getStaffById);
router.patch("/:staffId", authorize("manager"), updateStaffById);
router.delete("/:staffId", authorize("manager"), deleteStaff);
export default router;
