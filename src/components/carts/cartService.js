import { baseService } from "../utils/baseService.js";
import Cart from "./cartModel.js";
import Store from "../store/storeModel.js";
import geocoder from "./../utils/geocoder.js";
import mongoose from "mongoose";
import ErrorResponse from "../utils/ErrorResponse.js";
let rad = function (x) {
  return (x * Math.PI) / 180;
};
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
            from: "promotionproducts",
            localField: "products.productId",
            foreignField: "products",
            as: "product-promotion-detail",
          },
        },
        {
          $unwind: {
            path: "$product-promotion-detail",
            preserveNullAndEmptyArrays: true,
          },
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
          $project: {
            storeId: "$store-detail._id",
            productId: "$products.productId",
            storeAddress: "$store-detail.address",
            priceProduct: "$product-detail.price",
            amount: "$products.amountCart",
            percent: {
              $cond: [
                {
                  $and: [
                    {
                      $lte: [
                        "$product-promotion-detail.date_start",
                        new Date(),
                      ],
                    },
                    {
                      $gte: ["$product-promotion-detail.date_end", new Date()],
                    },
                  ],
                },
                { $subtract: [1, "$product-promotion-detail.percent"] },
                {
                  $cond: [
                    { $ifNull: ["$product-promotion-detail", false] },
                    0,
                    1,
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$productId",
            storeId: { $first: "$storeId" },
            storeAddress: { $first: "$storeAddress" },
            percent: {
              $sum: "$percent",
            },
            priceProduct: { $first: "$priceProduct" },
            amount: { $first: "$amount" },
            totalProduct: {
              $sum: {
                $multiply: ["$priceProduct", "$amount", "$percent"],
              },
            },
          },
        },
        {
          $group: {
            _id: "$storeId",
            storeAddress: { $first: "$storeAddress" },
            total: {
              $sum: "$totalProduct",
            },
            productOrder: {
              $push: {
                productId: "$_id",
                amountCart: "$amount",
                totalProduct: "$totalProduct",
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
    const storeLocation = await Store.findOne({ _id: store, status: "active" });
    if (!storeLocation) {
      throw new ErrorResponse(404, `Can not find this store`);
    }
    const loc = await geocoder.geocode(address);
    const locationDelivery = {
      type: "Point",
      coordinates: [loc[0].longitude, loc[0].latitude],
    };
    console.log(locationDelivery);
    // const agg = await Store.aggregate([
    //   {
    //     $geoNear: {
    //       near: locationDelivery,
    //       query: { _id: store },
    //       distanceField: "distance",
    //     },
    //   },
    // ]);
    // return agg[0].distance;
    const R = 6378137; // Earth’s mean radius in meter
    const dLat = rad(
      locationDelivery.coordinates[1] - storeLocation.location.coordinates[1]
    );
    const dLong = rad(
      locationDelivery.coordinates[0] - storeLocation.location.coordinates[0]
    );
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(storeLocation.location.coordinates[1])) *
        Math.cos(rad(locationDelivery.coordinates[1])) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    console.log("d", d);
    return d; // returns the distance in meter
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
        {
          $lookup: {
            from: "promotionproducts",
            localField: "products.productId",
            foreignField: "products",
            as: "product-promotion-detail",
          },
        },
        {
          $unwind: {
            path: "$product-promotion-detail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            priceProduct: "$product-detail.price",
            amount: "$products.amountCart",
            percent: {
              $cond: [
                {
                  $and: [
                    {
                      $lte: [
                        "$product-promotion-detail.date_start",
                        new Date(),
                      ],
                    },
                    {
                      $gte: ["$product-promotion-detail.date_end", new Date()],
                    },
                  ],
                },
                { $subtract: [1, "$product-promotion-detail.percent"] },
                {
                  $cond: [
                    { $ifNull: ["$product-promotion-detail", false] },
                    0,
                    1,
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: customerId,
            total: {
              $sum: {
                $multiply: ["$priceProduct", "$amount", "$percent"],
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
