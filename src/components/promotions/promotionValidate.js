import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemas = {
  postPromotion: Joi.object({
    name: Joi.string().required(),
    date_start: Joi.date().required(),
    date_end: Joi.date().greater(Joi.ref("date_start")).required(),
    percent: Joi.number().min(0).max(1).required(),
  }),
  paramPromotion: Joi.object({
    promotionId: myJoiObjectId().trim().required(),
  }),
  updatePromotion: {
    name: Joi.string().trim(),
    date_start: Joi.date(),
    date_end: Joi.date().greater(Joi.ref("date_start")),
    percent: Joi.number().min(0).max(1),
  },
};
export default schemas;
