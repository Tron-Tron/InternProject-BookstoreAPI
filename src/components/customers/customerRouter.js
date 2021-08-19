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
const routerCustomer = express.Router();
const routerAdmin = express.Router();
router.use(routerCustomer);
routerCustomer.use(jwtAuth, authorize("customer"));
routerCustomer.patch(
  "/",
  upload.single("avatar"),
  validateMiddleware(customerValidate.postCustomer, "body"),
  updateProfileCustomer
);
routerCustomer.get("/", getProfile);
router.use("/admin", routerAdmin);
routerAdmin.use(jwtAuth, authorize("admin"));
routerAdmin.delete(
  "/:customerId",
  validateMiddleware(customerValidate.paramCustomer, "params"),
  deleteCustomer
);
routerAdmin.get(
  "/all",
  validateMiddleware(paginationValidate.paging, "query"),
  getAllCustomers
);
export default router;
