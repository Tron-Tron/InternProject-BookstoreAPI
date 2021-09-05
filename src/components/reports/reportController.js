import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SuccessResponse from "../utils/SuccessResponse.js";
import { reportService } from "../reports/reportService.js";
import Order from "../orders/orderModel.js";
import mongoose from "mongoose";
export const getReportProductByMonth = asyncMiddleware(
  async (req, res, next) => {
    const aggProduct = await Order.aggregate([
      {
        $match: {
          store: new mongoose.Types.ObjectId(req.user.storeId),
          status: "delivered",
        },
      },
      {
        $unwind: "$productOrder",
      },
      {
        $lookup: {
          from: "products",
          localField: "productOrder.productId",
          foreignField: "_id",
          as: "product-detail",
        },
      },
      {
        $unwind: "$product-detail",
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$updatedAt",
            },
            month: {
              $month: "$updatedAt",
            },
            productId: "$productOrder.productId",
          },
          revenue: {
            $sum: {
              $multiply: ["$product-detail.price", "$productOrder.amountCart"],
            },
          },
          total_order: { $sum: "$productOrder.amountCart" },
        },
      },
      {
        $project: {
          month: {
            $concat: [
              { $substr: ["$_id.month", 0, 2] },
              "-",
              { $substr: ["$_id.year", 0, 4] },
            ],
          },
          productId: "$_id.productId",
          amount: "$total_order",
          revenue: "$revenue",
        },
      },
      {
        $group: {
          _id: "$month",
          report: {
            $push: {
              productId: "$productId",
              revenue: "$revenue",
              total_order: "$amount",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          monthReport: "$_id",
          report: "$report",
        },
      },
    ]);
    return new SuccessResponse(200, aggProduct).send(res);
  }
);
export const createReportProduct = asyncMiddleware(async (req, res, next) => {
  const { from_date, to_date } = req.body;
  const aggProduct = await Order.aggregate([
    {
      $match: {
        updatedAt: {
          $gte: new Date(from_date),
          $lte: new Date(to_date),
        },
        status: "delivered",
        store: new mongoose.Types.ObjectId(req.user.storeId),
      },
    },
    {
      $unwind: "$product_orders",
    },
    {
      $lookup: {
        from: "products",
        localField: "product_orders.productId",
        foreignField: "_id",
        as: "product-detail",
      },
    },
    {
      $unwind: "$product-detail",
    },
    {
      $group: {
        _id: "$product_orders.productId",
        // revenue: {
        //   $sum: {
        //     $multiply: ["$product-detail.price", "$product_orders.amountCart"],
        //   },
        // },
        revenue: {
          $sum: "$product_orders.totalProduct",
        },
        total_order: { $sum: "$product_orders.amountCart" },
      },
    },
    {
      $project: {
        //   productId: "$_id",
        amount: "$total_order",
        revenue: "$revenue",
      },
    },
  ]);

  return new SuccessResponse(200, aggProduct).send(res);
});
export const createReportCategory = asyncMiddleware(async (req, res, next) => {
  const { from_date, to_date } = req.body;
  const aggCategory = await Order.aggregate([
    {
      $match: {
        updatedAt: {
          $gte: new Date(from_date),
          $lte: new Date(to_date),
        },
        status: "delivered",
        store: new mongoose.Types.ObjectId(req.user.storeId),
      },
    },
    {
      $unwind: "$product_orders",
    },
    {
      $lookup: {
        from: "products",
        localField: "product_orders.productId",
        foreignField: "_id",
        as: "cart_product",
      },
    },
    {
      $unwind: "$cart_product",
    },
    {
      $group: {
        _id: "$cart_product.category",
        revenue: {
          $sum: {
            $multiply: ["$cart_product.price", "$product_orders.amountCart"],
          },
        },
        total_order: { $sum: "$product_orders.amountCart" },
      },
    },
  ]);
  return new SuccessResponse(200, aggCategory).send(res);
});
export const createReportStore = asyncMiddleware(async (req, res, next) => {
  const { from_date, to_date } = req.body;
  console.log(from_date, to_date);
  const aggStore = await Order.aggregate([
    {
      $match: {
        updatedAt: {
          $gte: new Date(from_date),
          $lte: new Date(to_date),
        },
        status: "delivered",
      },
    },
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "store_detail",
      },
    },
    {
      $unwind: "$store_detail",
    },
    {
      $group: {
        _id: "$store_detail.name",
        total_statistic: { $sum: "$totalOrder" },
      },
    },
  ]);
  console.log(aggStore);
  return new SuccessResponse(200, aggStore).send(res);
});
