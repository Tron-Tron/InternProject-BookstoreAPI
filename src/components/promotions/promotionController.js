import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SuccessResponse from "../utils/SuccessResponse.js";
import { promotionService } from "./promotionService.js";
import standardizedString from "./../commons/standardizedString.js";
function randomText(num_of_symbol) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < num_of_symbol; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
export const createPromotion = asyncMiddleware(async (req, res, next) => {
  const { name, date_start, date_end, percent } = req.body;
  const promotion = await promotionService.create({
    name: standardizedString(name),
    date_start,
    date_end,
    promotion_code: randomText(6),
    percent,
  });
  return new SuccessResponse(201, promotion).send(res);
});
export const updatePromotion = asyncMiddleware(async (req, res, next) => {
  const { promotionId } = req.query;
  const updatedPromotion = await promotionService.findOneAndUpdate(
    {
      _id: promotionId,
    },
    req.body,
    { new: true }
  );
  if (!updatedPromotion) {
    throw new ErrorResponse(404, `${promotionId} is not exist`);
  }
  return new SuccessResponse(201, updatedPromotion).send(res);
});
export const getPromotionBuying = asyncMiddleware(async (req, res, next) => {
  const { promotion_code } = req.body;
  const promotion = await promotionService.findOne({
    promotion_code,
  });
  const dateNow = new Date();
  if (promotion.date_end.getTime() < dateNow.getTime()) {
    throw new ErrorResponse(404, `This promotion is out of date`);
  }
  if (!promotion) {
    throw new ErrorResponse(
      404,
      `promotion with code ${promotion_code} is not exist`
    );
  }
  return new SuccessResponse(200, promotion).send(res);
});
export const getAllPromotions = asyncMiddleware(async (req, res, next) => {
  const { page, perPage } = req.query;
  const promotions = await promotionService.getAll(
    null,
    null,
    null,
    page,
    perPage
  );
  if (!promotions.length) {
    throw new ErrorResponse(404, "No promotions");
  }
  return new SuccessResponse(200, promotions).send(res);
});
export const deletePromotion = asyncMiddleware(async (req, res, next) => {
  const { promotionId } = req.params;
  if (!promotionId.trim()) {
    throw new ErrorResponse(400, "promotionId is empty");
  }
  const deletedPromotion = await promotionService.findByIdAndDelete({
    _id: promotionId,
  });

  if (!deletedPromotion) {
    throw new ErrorResponse(404, ` Promotion ${promotionId} is not found`);
  }
  return new SuccessResponse(
    200,
    `Promotion id ${promotionId} is deleted successfully`
  ).send(res);
});
