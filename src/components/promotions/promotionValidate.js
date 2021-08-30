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
  postPromotionProduct: Joi.object({
    name: Joi.string().required(),
    date_start: Joi.date().required(),
    date_end: Joi.date().greater(Joi.ref("date_start")).required(),
    percent: Joi.number().min(0).max(1).required(),
    products: Joi.array().items(
      Joi.string()
        .regex(/^[0-9a-zA-Z]{24}$/)
        .required()
    ),
  }),
};
export default schemas;
