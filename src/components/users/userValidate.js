import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemas = {
  registerStaff: Joi.object({
    storeId: myJoiObjectId().trim().required(),
    roleRegister: Joi.string().trim().required(),
  }),
  paramRegisterStaff: Joi.object({
    userId: myJoiObjectId().trim().required(),
  }),
  postUser: Joi.object({
    username: Joi.string().trim().required(),
    // phoneNumber: Joi.string()
    //   .pattern(
    //     new RegExp("/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im")
    //   )
    //   .required(),
    // balance: Joi.number().required(),
    password: Joi.string().trim().required(),
  }),
};
export default schemas;
