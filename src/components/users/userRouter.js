import express from "express";
import jwtAuth from "./../../middleware/jwtAuth.js";
import {
  getProfile,
  updateProfile,
  registerToBeStaff,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "./usersController.js";
import validateMiddleware from "./../commons/validateMiddleware.js";
import userValidate from "./userValidate.js";
import paginationValidate from "./../utils/paginationValidate.js";
import authorize from "./../../middleware/authorize.js";

const router = express.Router();
router.get("/", jwtAuth, getProfile);
router.patch(
  "/",
  jwtAuth,
  validateMiddleware(userValidate.postUser, "body"),
  updateProfile
);
router.post(
  "/register-to-staff",
  jwtAuth,
  authorize("customer"),
  validateMiddleware(userValidate.registerStaff, "body"),
  registerToBeStaff
);
router.get(
  "/all",
  jwtAuth,
  authorize("admin"),
  validateMiddleware(paginationValidate.paging, "query"),
  getAllUsers
);
export default router;
