import { baseService } from "../utils/baseService.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import Promotion from "./promotionModel.js";

const service = (model) => {
  const checkExpiredPromotion = async (code) => {
    try {
      const promotion = await Promotion.findOne({ promotion_code: code });
      if (!promotion) {
        throw new ErrorResponse(404, `${code} is not exist`);
      }
      const dateNow = new Date();
      if (promotion.date_start.getTime() > dateNow.getTime()) {
        throw new ErrorResponse(400, `${code} is not ready to use`);
      }
      if (promotion.date_end.getTime() < dateNow.getTime()) {
        throw new ErrorResponse(400, `${code} is out of date`);
      }
      return promotion;
    } catch (error) {
      throw error;
    }
  };
  return { checkExpiredPromotion, ...baseService.bind(null, Promotion)() };
};
export const promotionService = {
  ...service(Promotion),
};
