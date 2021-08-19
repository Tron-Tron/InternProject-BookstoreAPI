import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemas = {
  postCustomer: Joi.object({
    customer_name: Joi.string().trim().required(),
    avatar: Joi.string().trim(),
    province: Joi.string(),
    district: Joi.string(),
    ward: Joi.string(),
    text: Joi.string(),
  }),
  paramCustomer: Joi.object({
    customerId: myJoiObjectId().trim().required(),
  }),
};
export default schemas;
