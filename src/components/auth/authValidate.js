import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemaAuth = {
  registerAuth: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  loginAuth: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  changePassword: Joi.object({
    password: Joi.string().trim().required(),
    newPassword: Joi.string().trim().required(),
  }),
  registerOwner: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    province: Joi.string().required(),
    district: Joi.string().required(),
    ward: Joi.string().required(),
    text: Joi.string().required(),
  }),
};
export default schemaAuth;
