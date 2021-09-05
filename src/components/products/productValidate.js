import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemas = {
  postProduct: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    category: myJoiObjectId().trim().required(),
    description: Joi.string().required(),
    amount: Joi.number().integer().positive().required(),
    author: Joi.string().required(),
    //   image: Joi.string().required(),
  }),
  paramProduct: Joi.object({
    productId: myJoiObjectId().trim().required(),
  }),
  updateProduct: Joi.object({
    name: Joi.string().allow(null, ""),
    price: Joi.number().positive().allow(null, ""),
    category: myJoiObjectId().trim().allow(null, ""),
    description: Joi.string().allow(null, ""),
    amount: Joi.number().integer().positive().allow(null, ""),
    author: Joi.string().allow(null, ""),
    //   image: Joi.string().required(),
  }),
};
export default schemas;
