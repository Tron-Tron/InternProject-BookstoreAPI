import { baseService } from "../utils/baseService.js";
import Cart from "./cartModel.js";
import Store from "../store/storeModel.js";
import geocoder from "./../utils/geocoder.js";
import mongoose from "mongoose";
const service = (model) => {
  const getCartDetail = async (userId) => {
    try {
      const agg = await Cart.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $unwind: "$products",
        },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "product-detail",
          },
        },
        {
          $unwind: "$product-detail",
        },
        {
          $lookup: {
            from: "stores",
            localField: "product-detail.store",
            foreignField: "_id",
            as: "store-detail",
          },
        },
        {
          $unwind: "$store-detail",
        },
        {
          $group: {
            _id: "$store-detail._id",
            storeAddress: { $first: "$store-detail.address" },
            total: {
              $sum: {
                $multiply: ["$product-detail.price", "$products.amountCart"],
              },
            },
            productOrder: {
              $push: {
                productId: "$products.productId",
                amountCart: "$products.amountCart",
              },
            },
          },
        },
      ]);
      return agg;
    } catch (err) {
      throw err;
    }
  };
  const getDistance = async (store, address) => {
    const loc = await geocoder.geocode(address);
    const location = {
      type: "Point",
      coordinates: [loc[0].longitude, loc[0].latitude],
    };
    const agg = await Store.aggregate([
      {
        $geoNear: {
          near: location,
          query: { _id: store },
          distanceField: "distance",
        },
      },
    ]);

    return agg[0].distance;
  };
  return { getCartDetail, getDistance, ...baseService.bind(null, Cart)() };
};
export const cartService = {
  ...service(Cart),
};
