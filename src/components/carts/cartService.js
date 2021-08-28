import { baseService } from "../utils/baseService.js";
import Cart from "./cartModel.js";
import Store from "../store/storeModel.js";
import geocoder from "./../utils/geocoder.js";
import mongoose from "mongoose";
const service = (model) => {
  const getCartDetail = async (customerId) => {
    try {
      const agg = await Cart.aggregate([
        {
          $match: {
            customer: new mongoose.Types.ObjectId(customerId),
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
      console.log(agg);
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
    // console.log("agg", agg);
    return agg[0].distance;
  };
  const getTotalCart = async (customerId) => {
    try {
      const agg = await Cart.aggregate([
        {
          $match: {
            customer: new mongoose.Types.ObjectId(customerId),
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
      ]);
      console.log(agg);
      return agg;
    } catch (err) {
      throw err;
    }
  };
  return {
    getCartDetail,
    getDistance,
    getTotalCart,
    ...baseService.bind(null, Cart)(),
  };
};
export const cartService = {
  ...service(Cart),
};
