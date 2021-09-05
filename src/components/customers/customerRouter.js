import express from "express";
import authorize from "../../middleware/authorize.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import customerValidate from "./customerValidate.js";
import upload from "../commons/upload.js";
import paginationValidate from "./../utils/paginationValidate.js";
import validateMiddleware from "../commons/validateMiddleware.js";
import {
  updateProfileCustomer,
  deleteCustomer,
  getProfile,
  getAllCustomers,
} from "./customerController.js";

const router = express.Router();
router.use(jwtAuth);
router.patch(
  "/",
  authorize("customer"),
  upload.single("avatar"),
  validateMiddleware(customerValidate.postCustomer, "body"),
  updateProfileCustomer
);
router.get("/", authorize("customer"), getProfile);

router.delete(
  "/:customerId",
  authorize("admin"),
  validateMiddleware(customerValidate.paramCustomer, "params"),
  deleteCustomer
);
router.get(
  "/all",
  authorize("admin"),
  validateMiddleware(paginationValidate.paging, "query"),
  getAllCustomers
);
export default router;
