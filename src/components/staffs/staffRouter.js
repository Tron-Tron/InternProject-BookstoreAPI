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
  getAllStaffStore,
  deleteStaff,
} from "./staffController.js";
const router = express.Router();
router.use(jwtAuth, authorize("manager"));
router.post(
  "/",
  validateMiddleware(staffValidate.registerStaff, "body"),
  registerStaff
);
export default router;
