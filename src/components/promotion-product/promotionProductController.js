import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SuccessResponse from "../utils/SuccessResponse.js";
import { promotionProductService } from "./promotionProductService.js";
import { productService } from "./../products/productService.js";
import standardizedString from "./../commons/standardizedString.js";
function randomText(num_of_symbol) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < num_of_symbol; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
export const createPromotionProduct = asyncMiddleware(
  async (req, res, next) => {
    let { name, date_start, date_end, percent, products } = req.body;
    const store = req.user.storeId;
    //check phan tu trung
    let newArrProduct = [];
    newArrProduct = products.filter((item) => {
      return newArrProduct.includes(item) ? "" : newArrProduct.push(item);
    });
    //kiem tra cac id trong mang
    for (const productId of newArrProduct) {
      const checkProduct = await productService.findOne({
        _id: productId,
        status: "active",
        store,
      });
      if (!checkProduct) {
        throw new ErrorResponse(404, `${productId} is not exist`);
      }
      if (checkProduct.amount < 1) {
        throw new ErrorResponse(
          400,
          `amount product ${productId} in stock is not enough`
        );
      }
      const isExistOnPromotion =
        await promotionProductService.isExistOnProductPromotion(
          productId,
          store
        );
    }
    const promotion = await promotionProductService.create({
      name: standardizedString(name),
      date_start,
      date_end,
      promotion_code: randomText(6),
      percent,
      products: newArrProduct,
      store,
    });
    return new SuccessResponse(201, promotion).send(res);
  }
);
export const updatePromotionProduct = asyncMiddleware(
  async (req, res, next) => {
    const { promotionId } = req.query;
    const store = req.user.storeId;
    let { name, date_start, date_end, percent, products } = req.body;
    //check phan tu trung
    let newArrProduct = [];
    newArrProduct = products.filter((item) => {
      return newArrProduct.includes(item) ? "" : newArrProduct.push(item);
    });
    //kiem tra cac id trong mang
    for (const productId of newArrProduct) {
      const checkProduct = await productService.findOne({
        _id: productId,
        status: "active",
        store,
      });
      if (!checkProduct) {
        throw new ErrorResponse(404, `${productId} is not exist`);
      }
      if (checkProduct.amount < 1) {
        throw new ErrorResponse(
          400,
          `amount product ${productId} in stock is not enough`
        );
      }
      //  await promotionProductService.isExistOnProductPromotion(productId, store);
    }
    const updatedPromotion = await promotionProductService.findOneAndUpdate(
      {
        _id: promotionId,
        store,
      },
      {
        name: standardizedString(name),
        date_start,
        date_end,
        percent,
        products,
      },
      { new: true }
    );
    if (!updatedPromotion) {
      throw new ErrorResponse(404, `${promotionId} is not exist`);
    }
    return new SuccessResponse(201, updatedPromotion).send(res);
  }
);
