import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemas = {
  registerStaff: Joi.object({
    staff_name: Joi.string().trim().required(),
    email: Joi.string().trim(),
    province: Joi.string(),
    district: Joi.string(),
    ward: Joi.string(),
    text: Joi.string(),
    roles: Joi.string(),
  }),
  paramStaff: Joi.object({
    staffId: myJoiObjectId().trim().required(),
  }),
};
export default schemas;
