import express from "express";
import {
  getReportProductByMonth,
  createReportProduct,
  createReportCategory,
  createReportStore,
} from "./reportController.js";
import authorize from "../../middleware/authorize.js";
import jwtAuth from "../../middleware/jwtAuth.js";
const router = express.Router();
router.get(
  "/product-month",
  jwtAuth,
  authorize("manager", "officer"),
  getReportProductByMonth
);
router.get(
  "/product/",
  jwtAuth,
  authorize("manager", "officer"),
  createReportProduct
);
router.get(
  "/category/",
  jwtAuth,
  authorize("manager", "officer"),
  createReportCategory
);
router.get("/store/", jwtAuth, authorize("admin"), createReportStore);
export default router;
