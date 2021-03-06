import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SuccessResponse from "../utils/SuccessResponse.js";
import { cartService } from "./cartService.js";
import { orderService } from "../orders/orderService.js";
import { productService } from "../products/productService.js";
import { customerService } from "../customers/customerService.js";
import { promotionService } from "../promotions/promotionService.js";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
import distance from "google-distance";
distance.apiKey = process.env.API_KEY;
import mongoose from "mongoose";
import Order from "../orders/orderModel.js";
import { storeService } from "../store/storeService.js";

export const addProductCart = asyncMiddleware(async (req, res, next) => {
  const { productId, amountCart } = req.body;
  const emailLogin = req.user.email;
  const customer = await customerService.findOne({
    email: emailLogin,
    status: "active",
  });
  if (!customer) {
    throw new ErrorResponse(404, `Customer email ${emailLogin} is not exist`);
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session, returnOriginal: false };
    let cart = await cartService.findOne({ customer: customer._id });
    if (!cart) {
      throw new ErrorResponse(400, "No cart");
    }
    const isExistProduct = await productService.findOne({
      _id: productId,
      status: "active",
    });
    if (!isExistProduct) {
      throw new ErrorResponse(404, `id product ${productId} is not exist`);
    }
    if (isExistProduct.amount === 0 || isExistProduct.amount < amountCart) {
      throw new ErrorResponse(
        400,
        `${isExistProduct.name} is out of stock or not enough for you`
      );
    }
    const checkActiveStore = await storeService.findOne({
      _id: isExistProduct.store,
      status: "active",
    });
    if (!checkActiveStore) {
      throw new ErrorResponse(
        401,
        "You can not add this product because this store is no longer active"
      );
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
  const emailLogin = req.user.email;
  const customer = await customerService.findOne({
    email: emailLogin,
    status: "active",
  });
  if (!customer) {
    throw new ErrorResponse(404, `Customer email ${emailLogin} is not exist`);
  }
  const cart = await cartService.findOneAndUpdate(
    { customer: customer._id },
    { paymentMethod, deliveryAddress }
  );
  if (!cart) {
    throw new ErrorResponse(400, "No cart");
  }
  return new SuccessResponse(200, cart).send(res);
});
export const confirmDelivery = asyncMiddleware(async (req, res, next) => {
  let { paymentMethod, province, district, ward, text, voucher, note, phone } =
    req.body;
  const emailLogin = req.user.email;
  const customer = await customerService.findOne({
    email: emailLogin,
    status: "active",
  });
  if (!customer) {
    throw new ErrorResponse(404, `Customer email ${emailLogin} is not exist`);
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session, new: true };
    const cart = await cartService.findOne({ customer: customer._id });
    if (!cart) {
      throw new ErrorResponse(400, "No cart");
    }
    for (let product of cart.products) {
      let checkAmountProduct = await productService.findOne({
        _id: product.productId,
      });
      if (product.amountCart > checkAmountProduct.amount) {
        throw new ErrorResponse(
          400,
          `The number of ${checkAmountProduct.name} products in stock is not enough`
        );
      }
    }
    const cartDetail = await cartService.getCartDetail(customer._id);
    if (!cartDetail.length) {
      throw new ErrorResponse(400, "Cart is empty");
    }
    if (!province && !district && !ward && !text) {
      if (
        customer.address.province === " " &&
        customer.address.district === " " &&
        customer.address.ward === " " &&
        customer.address.text === " "
      ) {
        throw new ErrorResponse(401, "Please add address delivery");
      }
      province = customer.address.province;
      district = customer.address.district;
      ward = customer.address.ward;
      text = customer.address.text;
    }
    if (!phone) {
      if (customer.phone === " ") {
        throw new ErrorResponse(401, "Please add phone number");
      }
      phone = customer.phone;
    }
    let promotionTotal;
    if (voucher) {
      const checkPromotion = await promotionService.checkExpiredPromotion(
        voucher
      );
      if (checkPromotion) {
        promotionTotal = checkPromotion.percent * cart.total;
      } else {
        promotionTotal = 0;
      }
    } else {
      promotionTotal = 0;
    }
    const shipFee = 1000;
    const address = `${text},${ward},${district},${province}`;
    const cartTotal = await cartService.getTotalCart(customer._id);
    for (const element of cartDetail) {
      const totalRateOnBill = (element.total / cartTotal[0].total).toFixed(2);
      const distanceDelivery = await cartService.getDistance(
        element._id,
        address
      );
      const totalOrder =
        element.total +
        (distanceDelivery / 100000).toFixed(2) * shipFee -
        totalRateOnBill * promotionTotal;

      for (const product_element of element.productOrder) {
        await productService.findOneAndUpdate(
          { _id: product_element.productId, status: "active" },
          { $inc: { amount: -product_element.amountCart } },
          opts
        );
      }
      await orderService.create(
        {
          customer: customer._id,
          status: "picking",
          store: element._id,
          product_orders: element.productOrder,
          ship: (distanceDelivery / 1000).toFixed(2) * shipFee,
          totalOrder,
          note,
          deliveryAddress: { province, district, ward, text },
        },
        opts
      );
    }
    await cartService.findOneAndUpdate(
      { customer: customer._id },
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
  const email = req.user.email;
  const customer = await customerService.findOne({ email, status: "active" });
  if (!customer) {
    throw new ErrorResponse(404, "No customer");
  }
  const cart = await cartService.findOne(
    { customer: customer._id },
    null,
    "products.productId"
  );
  if (!cart) {
    throw new ErrorResponse(400, "No cart");
  }
  return new SuccessResponse(200, cart).send(res);
});
