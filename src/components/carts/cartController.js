import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SuccessResponse from "../utils/SuccessResponse.js";
import { cartService } from "./cartService.js";
import { orderService } from "../orders/orderService.js";
import { productService } from "../products/productService.js";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
import distance from "google-distance";
distance.apiKey = process.env.API_KEY;
import mongoose from "mongoose";
import Order from "../orders/orderModel.js";

export const updatedProduct = asyncMiddleware(async (req, res, next) => {
  const { productId, amountCart } = req.body;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const opts = { session, returnOriginal: false };
    let cart = await cartService.findOne({ user: userId });
    if (!cart) {
      throw new ErrorResponse(400, "No cart");
    }
    const isExistProduct = await productService.findOne({
      _id: productId,
      status: "confirmed",
    });
    if (!isExistProduct) {
      throw new ErrorResponse(400, `id product ${productId} is not exist`);
    }
    const indexProduct = cart.products.findIndex(
      (value) => value.productId.toString() === productId
    );

    if (indexProduct > -1) {
      let product = cart.products[indexProduct];
      product.amountCart += amountCart;
      cart.products[indexProduct] = product;
      cart.total += amountCart * isExistProduct.price;
    } else {
      cart.total += amountCart * isExistProduct.price;
      cart.products.push({ productId, amountCart });
    }
    cart = await cartService.create(cart, opts);
    await session.commitTransaction();
    session.endSession();
    return new SuccessResponse(200, cart).send(res);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new ErrorResponse(400, err);
  }
});

export const checkout = asyncMiddleware(async (req, res, next) => {
  const { paymentMethod, deliveryAddress } = req.body;
  const userId = req.user._id;
  const cart = await cartService.findOneAndUpdate(
    { user: userId },
    { paymentMethod, deliveryAddress }
  );
  if (!cart) {
    throw new ErrorResponse(400, "No cart");
  }
  return new SuccessResponse(200, cart).send(res);
});
export const confirmDelivery = asyncMiddleware(async (req, res, next) => {
  const userId = req.user._id;
  const { note } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session, new: true };
    const cart = await cartService.findOne({ user: userId });
    if (!cart) {
      throw new ErrorResponse(400, "No cart");
    }
    const deliveryAddress = cart.deliveryAddress;
    if (deliveryAddress === " ") {
      throw new ErrorResponse(400, "Please add Delivery Address");
    }
    const cartDetail = await cartService.getCartDetail(userId);
    if (!cartDetail.length) {
      throw new ErrorResponse(400, "Cart is empty");
    }
    const shipFee = 5000;
    for (const element of cartDetail) {
      const distanceDelivery = await new Promise((result, error) => {
        distance.get(
          {
            origin: element.storeAddress,
            destination: deliveryAddress,
          },
          function (err, data) {
            if (err) {
              error(err);
            } else {
              result(data.distanceValue);
            }
          }
        );
      }, opts).catch((err) => {
        throw err;
      });
      // const distance = await cartService.getDistance(
      //   element._id,
      //   deliveryAddress
      // );
      console.log("distanceDelivery", distanceDelivery);
      const totalOrder = element.total + (distanceDelivery / 1000) * shipFee;
      await orderService.create(
        {
          user: userId,
          status: "picking",
          store: element._id,
          productOrder: element.productOrder,
          totalOrder,
          note,
        },
        opts
      );
    }
    await cartService.findOneAndUpdate(
      { user: userId },
      { products: [], total: 0 },
      opts
    );
    await session.commitTransaction();
    session.endSession();
    return new SuccessResponse(200, "Cart is confirmed").send(res);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new ErrorResponse(400, err);
  }
});
export const confirmNotDelivery = asyncMiddleware(async (req, res, next) => {
  const userId = req.user._id;
  const { note } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const opts = { session, returnOriginal: false };
    const cart = await cartService.findOne({ user: userId });
    if (!cart) {
      throw new ErrorResponse(400, "No cart");
    }
    const deliveryAddress = cart.deliveryAddress;
    if (deliveryAddress === " ") {
      throw new ErrorResponse(400, "Please add Delivery Address");
    }
    const cartDetail = await cartService.getCartDetail(userId);
    if (!cartDetail.length) {
      throw new ErrorResponse(400, "Cart is empty");
    }
    for (const element of cartDetail) {
      await orderService.create(
        {
          user: userId,
          status: "picking",
          store: element._id,
          productOrder: element.productOrder,
          totalOrder: element.total,
          note,
        },
        opts
      );
    }
    await cartService.findOneAndUpdate(
      { user: userId },
      { products: [], total: 0 },
      opts
    );
    await session.commitTransaction();
    session.endSession();
    return new SuccessResponse(200, "Cart is confirmed").send(res);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new ErrorResponse(400, err);
  }
});
export const getCart = asyncMiddleware(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await cartService.findOne({ user: userId });
  if (!cart) {
    throw new ErrorResponse(400, "No cart");
  }
  return new SuccessResponse(200, cart).send(res);
});
