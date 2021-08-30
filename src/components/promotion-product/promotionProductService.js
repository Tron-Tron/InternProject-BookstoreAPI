import { baseService } from "../utils/baseService.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import PromotionProduct from "./PromotionProductModel.js";

const service = (model) => {
  const checkExpiredPromotion = async (code) => {
    try {
      const promotion = await PromotionProduct.findOne({
        promotion_code: code,
      });
      if (!promotion) {
        throw new ErrorResponse(404, `${code} is not exist`);
      }
      const dateNow = new Date();
      const dateStart = new Date(promotion.date_start);
      const dateEnd = new Date(promotion.date_end);
      if (dateStart.getTime() < dateNow.getTime()) {
        throw new ErrorResponse(400, `${code} is not ready to use`);
      }
      if (dateEnd.getTime() > dateNow.getTime()) {
        throw new ErrorResponse(400, `${code} is out of date`);
      }
      return promotion;
    } catch (error) {
      throw error;
    }
  };
  const isExistOnProductPromotion = async (productId, store) => {
    try {
      const currentDate = Date.now();
      const usedPromotion = await PromotionProduct.find({
        date_start: { $lte: currentDate },
        date_end: { $gte: currentDate },
        store,
      });
      if (usedPromotion) {
        usedPromotion.map((itemPromotion) => {
          if (itemPromotion.products.includes(productId)) {
            throw new ErrorResponse(
              400,
              `product ${productId} is exist on another promotion`
            );
          }
        });
      }
      return true;
    } catch (error) {
      throw error;
    }
  };
  return {
    checkExpiredPromotion,
    isExistOnProductPromotion,
    ...baseService.bind(null, PromotionProduct)(),
  };
};
export const promotionProductService = {
  ...service(PromotionProduct),
};
