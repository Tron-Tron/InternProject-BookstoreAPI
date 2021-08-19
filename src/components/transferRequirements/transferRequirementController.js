import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import mongoose from "mongoose";
import ErrorResponse from "../utils/errorResponse.js";
import SuccessResponse from "../utils/successResponse.js";
import { transferRequirementService } from "./transferRequirementService.js";
import { userService } from "../users/userService.js";
export const deposit = asyncMiddleware(async (req, res, next) => {
  const { userId } = req.params;
  const { amount } = req.body;
  if (amount <= 0) {
    throw new ErrorResponse(400, "amount must be > 0");
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session, new: true };
    const transfer = await transferRequirementService.create(
      {
        user: userId,
        type: "deposit",
        status: "confirmed",
        amount,
      },
      opts
    );
    const user = await userService.findOneAndUpdate(
      { _id: userId },
      { $inc: { balance: amount } },
      opts
    );
    await session.commitTransaction();
    session.endSession();
    return new SuccessResponse(200, user).send(res);
  } catch (error) {
    await session.abortTransaction();
    throw new ErrorResponse(400, error);
  } finally {
    session.endSession();
  }
});
export const withdrawRequirement = asyncMiddleware(async (req, res, next) => {
  const user = req.user._id;
  const { amount } = req.body;
  if (amount <= 0) {
    throw new ErrorResponse(400, "amount must be > 0");
  }
  const transfer = await transferRequirementService.create({
    user,
    type: "withdraw",
    status: "waiting",
    amount,
  });
  return new SuccessResponse(200, transfer);
});
export const approveWithdrawRequirement = asyncMiddleware(
  async (req, res, next) => {
    const { idRequirement } = req.params;
    const requirement = await transferRequirementService.findOneAndUpdate(
      {
        _id: idRequirement,
        status: "waiting",
      },
      { status: "confirming" },
      { new: true }
    );
    if (!requirement) {
      throw new ErrorResponse(400, "No requirement");
    }
    return new SuccessResponse(200, requirement).send(res);
  }
);
export const confirmWithdrawRequirement = asyncMiddleware(
  async (req, res, next) => {
    const { idRequirement } = req.params;
    const userId = req.user._id;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const opts = { session, returnOriginal: false };

      const user = await userService.findOneAndUpdate(
        { _id: userId },
        { $inc: { balance: -amount } },
        opts
      );
      if (user.balance < 0) {
        throw new Error("Insufficient funds: " + (user.balance + amount));
      }
      await transferRequirementService.findOneAndUpdate(
        {
          _id: idRequirement,
          status: "confirming",
          user: userId,
        },
        { status: "confirmed" },
        opts
      );
      await session.commitTransaction();
      session.endSession();
      return new SuccessResponse(200, user).send(res);
    } catch (error) {
      await session.abortTransaction();
      throw new ErrorResponse(400, error);
    } finally {
      session.endSession();
    }
  }
);
