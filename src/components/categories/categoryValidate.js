import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemas = {
  postCategory: Joi.object({
    name: Joi.string().trim().required(),
  }),
  paramCategory: Joi.object({
    categoryId: myJoiObjectId().trim().required(),
  }),
};
export default schemas;
