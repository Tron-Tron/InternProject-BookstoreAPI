import { baseService } from "../utils/baseService.js";
import { Product } from "./productModel.js";
import mongoose from "mongoose";

const service = (model) => {
  const getProductWithPromotion = async () => {
    try {
      const agg = await Product.aggregate([
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
      ]);
      console.log("agg", agg);
      return agg;
    } catch (error) {
      throw error;
    }
  };
  return { getProductWithPromotion, ...baseService.bind(null, Product)() };
};
export const productService = {
  ...service(Product),
};
