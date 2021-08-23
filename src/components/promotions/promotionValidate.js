import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemas = {
  postPromotion: Joi.object({
    name: Joi.string().trim().required(),
    date_start: Joi.date().required(),
    date_end: Joi.date().greater(Joi.ref("date_start")).required(),
    promotion_code: Joi.string().trim().required(),
    percent: Joi.number().min(0).max(1).required(),
  }),
  paramPromotion: Joi.object({
    promotionId: myJoiObjectId().trim().required(),
  }),
};
export default schemas;
