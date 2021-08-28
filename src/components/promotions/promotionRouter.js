import express from "express";
import {
  createPromotion,
  updatePromotion,
  getPromotionBuying,
  getAllPromotions,
  deletePromotion,
} from "./promotionController.js";
import validateMiddleware from "../commons/validateMiddleware.js";
import promotionValidate from "./promotionValidate.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import authorize from "../../middleware/authorize.js";
import paginationValidate from "../utils/paginationValidate.js";
const router = express.Router();
//router.use(jwtAuth);
router.post(
  "/",
  jwtAuth,
  authorize("admin"),
  validateMiddleware(promotionValidate.postPromotion, "body"),
  createPromotion
);
router.patch(
  "/:promotionId",
  authorize("admin"),
  validateMiddleware(promotionValidate.paramPromotion, "params"),
  validateMiddleware(promotionValidate.updatePromotion, "body"),
  updatePromotion
);
router.delete(
  "/:promotionId",
  authorize("admin"),
  validateMiddleware(promotionValidate.paramPromotion, "params"),
  deletePromotion
);
router.get(
  "/all",
  validateMiddleware(paginationValidate.paging, "query"),
  getAllPromotions
);

router.get("/", getPromotionBuying);
export default router;
