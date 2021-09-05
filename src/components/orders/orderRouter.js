import express from "express";
import {
  getOrderStore,
  completeStatusOrderUser,
  cancelOrder,
  updateStatusOrderStore,
  getUserOrder,
  confirmOrderStore,
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
routerUser.patch(
  "/:orderId",
  validateMiddleware(orderValidate.paramOrder, "params"),
  completeStatusOrderUser
);
routerUser.delete(
  "/:orderId",
  validateMiddleware(orderValidate.paramOrder, "params"),
  cancelOrder
);

router.use("/store", routerStore);
routerStore.use(jwtAuth);
routerStore.patch(
  "/:orderId",
  authorize("shipper"),
  validateMiddleware(orderValidate.paramOrder, "params"),
  updateStatusOrderStore
);
routerStore.patch(
  "/confirm/:orderId",
  authorize("officer"),
  validateMiddleware(orderValidate.paramOrder, "params"),
  confirmOrderStore
);
routerStore.get(
  "/:orderId",
  validateMiddleware(orderValidate.paramOrder, "params"),
  getOrderStore
);
export default router;
