import express from "express";
import {
  register,
  login,
  changePassword,
  registerStoreAccount,
} from "./authController.js";
import validateMiddleware from "../commons/validateMiddleware.js";
import authValidate from "./authValidate.js";
import jwtAuth from "../../middleware/jwtAuth.js";
const router = express.Router();

router.post(
  "/register",
  validateMiddleware(authValidate.registerAuth, "body"),
  register
);
router.post(
  "/register-store",
  validateMiddleware(authValidate.registerOwner, "body"),
  registerStoreAccount
);
router.post(
  "/login",
  validateMiddleware(authValidate.loginAuth, "body"),
  login
);
router.patch(
  "/change-password",
  jwtAuth,
  validateMiddleware(authValidate.changePassword, "body"),
  changePassword
);
export default router;
