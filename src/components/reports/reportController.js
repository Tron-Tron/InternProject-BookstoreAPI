import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SuccessResponse from "../utils/SuccessResponse.js";
import { reportService } from "../reports/reportService.js";
import Order from "../orders/orderModel.js";
import mongoose from "mongoose";
export const createReportProduct = asyncMiddleware(async (req, res, next) => {
  const aggProduct = await Order.aggregate([
    {
      $match: {
        store: new mongoose.Types.ObjectId(req.user.storeId),
        //        status: "completed",
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

  const newReport = await reportService.create({
    store: req.user.storeId,
    reportProduct: aggProduct,
  });

  return new SuccessResponse(200, newReport).send(res);
});
