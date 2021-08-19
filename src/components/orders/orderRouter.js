import express from "express";
import {
  getOrderStore,
  completeStatusOrderUser,
  cancelOrder,
  updateStatusOrderStore,
  getUserOrder,
} from "./orderController.js";
import orderValidate from "./orderValidate.js";
import validateMiddleware from "../commons/validateMiddleware.js";
import authorize from "../../middleware/authorize.js";
import jwtAuth from "../../middleware/jwtAuth.js";
const router = express.Router();
const routerStore = express.Router();
const routerUser = express.Router();

router.use("/user", routerUser);
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
routerStore.use(jwtAuth, authorize("shipper"));
routerStore.patch(
  "/:orderId",
  validateMiddleware(orderValidate.paramOrder, "params"),
  updateStatusOrderStore
);
routerStore.get(
  "/:orderId",
  validateMiddleware(orderValidate.paramOrder, "params"),
  getOrderStore
);

export default router;
