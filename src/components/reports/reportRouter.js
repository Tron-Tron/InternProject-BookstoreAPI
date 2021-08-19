import express from "express";
import { createReportProduct } from "./reportController.js";
import authorize from "../../middleware/authorize.js";
import jwtAuth from "../../middleware/jwtAuth.js";
const router = express.Router();
router.post("/", jwtAuth, authorize("manager", "officer"), createReportProduct);

export default router;
