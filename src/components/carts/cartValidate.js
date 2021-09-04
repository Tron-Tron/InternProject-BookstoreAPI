import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemas = {
  addProduct: Joi.object({
    productId: myJoiObjectId().trim().required(),
    amountCart: Joi.number().integer().positive().required(),
  }),
  paramCart: Joi.object({
    cartId: myJoiObjectId().trim().required(),
  }),
  checkout: Joi.object({
    paymentMethod: Joi.string().trim().required(),
    deliveryAddress: Joi.string().required(),
  }),
};
export default schemas;
