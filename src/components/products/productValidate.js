import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemas = {
  postProduct: Joi.object({
    name: Joi.string().trim().required(),
    price: Joi.number().required(),
    category: myJoiObjectId().trim().required(),
    description: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    //   image: Joi.string().required(),
  }),
  paramProduct: Joi.object({
    productId: myJoiObjectId().trim().required(),
  }),
};
export default schemas;
