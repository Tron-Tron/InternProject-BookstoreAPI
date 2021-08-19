import express from "express";
import authorize from "../../middleware/authorize.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import validateMiddleware from "./../commons/validateMiddleware.js";

import {
  deposit,
  withdrawRequirement,
  approveWithdrawRequirement,
  confirmWithdrawRequirement,
} from "./transferRequirementController.js";
const router = express.Router();

router.post(
  "/deposit/:userId",
  jwtAuth,
  authorize("manager", "cashier"),
  deposit
);
router.post("/withdraw/", jwtAuth, authorize("customer"), withdrawRequirement);
router.patch(
  "/withdraw/:idRequirement",
  jwtAuth,
  authorize("manager", "cashier"),
  approveWithdrawRequirement
);
router.put(
  "/withdraw/:idRequirement",
  jwtAuth,
  authorize("customer"),
  confirmWithdrawRequirement
);
