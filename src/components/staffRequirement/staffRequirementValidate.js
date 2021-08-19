import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const schemas = {
  paramRequirement: Joi.object({
    id: myJoiObjectId().trim().required(),
  }),
};
export default schemas;
