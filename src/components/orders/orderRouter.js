import express from "express";
import {
  getOrderStore,
  cancelOrder,
  updateStatus,
  getUserOrder,
  confirmOrderStore,
  getAllOrderStore,
} from "./orderController.js";
import orderValidate from "./orderValidate.js";
import validateMiddleware from "../commons/validateMiddleware.js";
import authorize from "../../middleware/authorize.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import mongoose from "mongoose";
const router = express.Router();
const routerStore = express.Router();
const routerUser = express.Router();

router.use("/customer", routerUser);
routerUser.use(jwtAuth, authorize("customer"));
routerUser.get("/", getUserOrder);
routerUser.delete(
  "/:orderId",
  validateMiddleware(orderValidate.paramOrder, "params"),
  cancelOrder
);

router.use("/store", routerStore);
routerStore.use(jwtAuth);
routerStore.get(
  "/all",
  authorize("shipper", "manager", "officer"),
  getAllOrderStore
);
routerStore.patch(
  "/:orderId",
  authorize("shipper", "manager", "officer"),
  validateMiddleware(orderValidate.paramOrder, "params"),
  updateStatus
);
routerStore.patch(
  "/confirm/:orderId",
  authorize("officer"),
  validateMiddleware(orderValidate.paramOrder, "params"),
  confirmOrderStore
);
routerStore.get(
  "/:orderId",
  authorize("shipper", "manager", "officer"),
  validateMiddleware(orderValidate.paramOrder, "params"),
  getOrderStore
);
export default router;
