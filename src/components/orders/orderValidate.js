import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemas = {
  paramOrder: Joi.object({
    orderId: myJoiObjectId().trim().required(),
  }),
};
export default schemas;
