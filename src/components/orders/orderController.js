import asyncMiddleware from "../../middleware/asyncMiddleware.js";

import ErrorResponse from "../utils/errorResponse.js";
import SuccessResponse from "../utils/successResponse.js";
import { orderService } from "./orderService.js";
import { productService } from "../products/productService.js";
import { userService } from "../users/userService.js";
import mongoose from "mongoose";
export const getAllOrderStore = asyncMiddleware(async (req, res, next) => {
  const storeId = req.user.storeId;
  const order = await orderService.getAll({ store: storeId });
  if (!order) {
    throw new ErrorResponse(404, "No orders");
  }
  return new SuccessResponse(200, order).send(res);
});
export const confirmOrderStore = asyncMiddleware(async (req, res, next) => {
  const { orderId } = req.params;
  const storeId = req.user.storeId;
  const updatedOrder = await orderService.findOneAndUpdate(
    {
      _id: orderId,
      store: storeId,
      status: "picking",
    },
    { status: "picked" },
    { new: true }
  );
  if (!updatedOrder) {
    throw new ErrorResponse(404, "No order");
  }
  return new SuccessResponse(200, updatedOrder).send(res);
});
export const updateStatusOrderStore = asyncMiddleware(
  async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const storeId = req.user.storeId;
    const statusShipper = ["delivering", "delivered", "cancel"];
    if (!statusShipper.includes(status)) {
      throw new ErrorResponse(400, "Status is not exist");
    }
    const updatedOrder = await orderService.findOneAndUpdate(
      {
        _id: orderId,
        store: storeId,
        status: { $nin: ["canceled"] },
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
    const customer = await customerService.findOne({
      email: req.user.email,
      status: "active",
    });
    if (!customer) {
      throw new ErrorResponse(404, `No customer has email ${req.user.email}`);
    }
    const order = await orderService.findOne({
      _id: orderId,
      customer: customer._id,
      status: { $nin: ["delivered", "canceled"] },
    });
    if (!order) {
      throw new ErrorResponse(404, "No order");
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const opts = { session, new: true };
      const updatedOrder = await orderService.findOneAndUpdate(
        {
          _id: orderId,
          customer: customer._id,
          status: { $nin: ["delivered", "canceled"] },
        },
        { status: "canceled" },
        opts
      );
      const order = await orderService.findOne({
        _id: orderId,
        customer: customer._id,
        status: "canceled",
      });
      if (!order) {
        throw new ErrorResponse(404, "No order");
      }
      for (const element of order.product_orders) {
        await productService.findOneAndUpdate(
          { _id: element.productId },
          { $inc: { amount: element.amountCart } },
          opts
        );
      }
      return new SuccessResponse(200, updatedOrder).send(res);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw new ErrorResponse(400, err);
    }
  }
);
export const updateStatus = asyncMiddleware(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const role = req.user.roles;
  const storeId = req.user.storeId;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session, returnOriginal: false };
    const order = await orderService.findOne({
      _id: orderId,
      store: req.user.storeId,
      //      status: { $nin: ["delivered", "canceled"] },
    });
    if (!order) {
      throw new ErrorResponse(404, "No order");
    }
    let canceledOrder;
    if (role === "shipper") {
      if (status === "canceled") {
        canceledOrder = await orderService.findOneAndUpdate(
          {
            _id: orderId,
            store: storeId,
            status: { $nin: ["delivering", "canceled", "delivered"] },
          },
          { status: "canceled" },
          opts
        );
        if (!canceledOrder) {
          throw new ErrorResponse(400, "Cannot cancel this order");
        }
        // const order = await orderService.findOne({
        //   _id: orderId,
        //   store: storeId,
        //   status: "canceled",
        // });
        // if (!order) {
        //   throw new ErrorResponse(404, "No order");
        // }
        for (const element of order.product_orders) {
          await productService.findOneAndUpdate(
            { _id: element.productId },
            { $inc: { amount: element.amountCart } },
            opts
          );
        }
      } else {
        const statusShipper = ["delivering", "delivered", "canceled"];
        if (!statusShipper.includes(status)) {
          throw new ErrorResponse(400, "Status is not exist");
        }
        canceledOrder = await orderService.findOneAndUpdate(
          {
            _id: orderId,
            store: storeId,
            status: { $nin: ["canceled"] },
          },
          { status },
          { new: true }
        );
        if (!canceledOrder) {
          throw new ErrorResponse(404, "No order");
        }
      }
    } else {
      if (status === "canceled") {
        canceledOrder = await orderService.findOneAndUpdate(
          {
            _id: orderId,
            store: storeId,
            status: { $nin: ["delivering", "canceled", "delivered"] },
          },
          { status: "canceled" },
          opts
        );
        if (!canceledOrder) {
          throw new ErrorResponse(400, "Cannot cancel this order");
        }
        for (const element of order.product_orders) {
          await productService.findOneAndUpdate(
            { _id: element.productId },
            { $inc: { amount: element.amountCart } },
            opts
          );
        }
      } else {
        const statusShipper = ["picked", "canceled"];
        if (!statusShipper.includes(status)) {
          throw new ErrorResponse(400, "Status is not exist");
        }
        canceledOrder = await orderService.findOneAndUpdate(
          {
            _id: orderId,
            store: storeId,
            status: { $nin: ["canceled"] },
          },
          { status },
          { new: true }
        );
        if (!canceledOrder) {
          throw new ErrorResponse(404, "No order");
        }
      }
    }
    await session.commitTransaction();
    session.endSession();
    return new SuccessResponse(
      200,
      "status order is updated successfully"
    ).send(res);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new ErrorResponse(400, err);
  }
});
export const cancelOrder = asyncMiddleware(async (req, res, next) => {
  const { orderId } = req.params;
  const customerId = req.user._id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const opts = { session, returnOriginal: false };
    const updatedOrder = await orderService.findOneAndUpdate(
      {
        _id: orderId,
        customer: customer._id,
        status: { $nin: ["delivered", "canceled"] },
      },
      { status: "canceled" },
      opts
    );
    const order = await orderService.findOne({
      _id: orderId,
      customer: customer._id,
      status: "canceled",
    });
    if (!order) {
      throw new ErrorResponse(404, "No order");
    }
    for (const element of order.product_orders) {
      await productService.findOneAndUpdate(
        { _id: element.productId },
        { $inc: { amount: element.amountCart } },
        opts
      );
    }
    await session.commitTransaction();
    session.endSession();
    return new SuccessResponse(200, "Your order is canceled successfully").send(
      res
    );
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new ErrorResponse(400, err);
  }
});
export const getOrderStore = asyncMiddleware(async (req, res, next) => {
  const store = req.user.storeId;
  const { orderId } = req.params;
  const order = await orderService.getAll(
    { _id: orderId, store },
    "product_orders",
    "product_orders.productId"
  );
  if (!order) {
    throw new ErrorResponse(400, `No order`);
  }
  return new SuccessResponse(200, order).send(res);
});
export const getUserOrder = asyncMiddleware(async (req, res, next) => {
  const email = req.user.email;
  const customer = await customerService.findOne({ email, status: "active" });
  if (!customer) {
    throw new ErrorResponse(404, "No customer");
  }
  const order = await orderService.getAll(
    { customer: customer._id },
    null,
    "products.productId"
  );
  if (!order) {
    throw new ErrorResponse(400, "No cart");
  }
  return new SuccessResponse(200, order).send(res);
});
