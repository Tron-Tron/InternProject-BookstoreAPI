import Joi from "joi";
const schemas = {
  paging: Joi.object({
    page: Joi.number().required(),
    perPage: Joi.number().required(),
  }),
};
export default schemas;
