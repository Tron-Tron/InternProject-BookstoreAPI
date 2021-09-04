import asyncMiddleware from "../../middleware/asyncMiddleware.js";

import ErrorResponse from "../utils/errorResponse.js";
import SuccessResponse from "../utils/successResponse.js";
import { orderService } from "./orderService.js";
import { userService } from "../users/userService.js";
import mongoose from "mongoose";
export const updateStatusOrderStore = asyncMiddleware(
  async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const storeId = req.user.storeId;
    const statusShipper = ["picking", "picked", "delivering", "delivered"];
    if (!statusShipper.includes(status)) {
      throw new ErrorResponse(400, "Status is not exist");
    }
    const updatedOrder = await orderService.findOneAndUpdate(
      {
        _id: orderId,
        store: storeId,
        status: { $nin: ["completed", "canceled"] },
      },
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      throw new ErrorResponse(404, "No order");
    }
    return new SuccessResponse(200, updatedOrder).send(res);
  }
);
export const completeStatusOrderUser = asyncMiddleware(
  async (req, res, next) => {
    const { orderId } = req.params;
    const userId = req.user._id;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const opts = { session, new: true };
      const updatedOrder = await orderService.findOneAndUpdate(
        {
          _id: orderId,
          user: userId,
        },
        { status: "completed" },
        opts
      );
      if (!updatedOrder) {
        throw new ErrorResponse(404, "No order");
      }
      const value = 0.0005 * updatedOrder.totalOrder;
      await userService.findOneAndUpdate(
        { _id: userId },
        { $inc: { balance: value } },
        opts
      );

      return new SuccessResponse(200, updatedOrder).send(res);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw new ErrorResponse(400, err);
    }
  }
);
export const cancelOrder = asyncMiddleware(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  const canceledOrder = await orderService.findOneAndUpdate(
    { _id: orderId, user: userId, status: "picking" },
    { status: "canceled" }
  );
  if (!canceledOrder) {
    throw new ErrorResponse(400, "Cannot cancel this order");
  }
  return new SuccessResponse(200, "Your order is canceled successfully").send(
    res
  );
});
export const getOrderStore = asyncMiddleware(async (req, res, next) => {
  const store = req.user.storeId;
  const order = await orderService.getAll({ store });
  if (!order) {
    throw new ErrorResponse(400, `No order`);
  }
  return new SuccessResponse(200, order).send(res);
});
export const getUserOrder = asyncMiddleware(async (req, res, next) => {
  const user = req.user._id;
  const { page, perPage } = req.query;
  const order = await orderService.getAll({ user }, null, null, page, perPage);
  if (!order.length) {
    throw new ErrorResponse(400, "No order");
  }
  return new SuccessResponse(200, order).send(res);
});
