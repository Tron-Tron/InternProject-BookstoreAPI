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
                productId: "$productId",
                amountCart: "$amount",
                totalProduct: "$totalProduct",
              },
            },
          },
        },
      ]);
      console.log("cart", agg);
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
