import express from "express";
import {
  createPromotion,
  updatePromotion,
  getPromotionBuying,
  getAllPromotions,
  deletePromotion,
} from "./promotionController.js";

import {
  createPromotionProduct,
  updatePromotionProduct,
} from "../promotion-product/promotionProductController.js";
import validateMiddleware from "../commons/validateMiddleware.js";
import promotionValidate from "./promotionValidate.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import authorize from "../../middleware/authorize.js";
import paginationValidate from "../utils/paginationValidate.js";

const router = express.Router();
const routerStore = express.Router();
const routerAdmin = express.Router();
routerAdmin.post(
  "/",
  validateMiddleware(promotionValidate.postPromotion, "body"),
  createPromotion
);
routerAdmin.patch(
  "/:promotionId",
  validateMiddleware(promotionValidate.paramPromotion, "params"),
  validateMiddleware(promotionValidate.updatePromotion, "body"),
  updatePromotion
);
routerAdmin.delete(
  "/:promotionId",
  validateMiddleware(promotionValidate.paramPromotion, "params"),
  deletePromotion
);
routerAdmin.get(
  "/all",
  validateMiddleware(paginationValidate.paging, "query"),
  getAllPromotions
);
routerAdmin.get("/", getPromotionBuying);

routerStore.post(
  "/",
  validateMiddleware(promotionValidate.postPromotionProduct, "body"),
  createPromotionProduct
);
routerStore.patch(
  "/:promotionId",
  validateMiddleware(promotionValidate.paramPromotion, "params"),
  validateMiddleware(promotionValidate.postPromotionProduct, "body"),
  updatePromotionProduct
);
router.use("/admin", jwtAuth, authorize("admin"), routerAdmin);
router.use("/store", jwtAuth, authorize("manager", "officer"), routerStore);
export default router;
