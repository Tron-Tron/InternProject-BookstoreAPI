import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemas = {
  postCustomer: Joi.object({
    customer_name: Joi.string().trim().allow(null, ""),
    avatar: Joi.string().trim().allow(null, ""),
    phone: Joi.string()
      .pattern(
        new RegExp("/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im")
      )
      .allow(null, ""),
    province: Joi.string().allow(null, ""),
    district: Joi.string().allow(null, ""),
    ward: Joi.string().allow(null, ""),
    text: Joi.string().allow(null, ""),
  }),
  paramCustomer: Joi.object({
    customerId: myJoiObjectId().trim().required(),
  }),
};
export default schemas;
