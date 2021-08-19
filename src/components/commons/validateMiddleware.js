// import ErrorResponse from "../utils/errorResponse.js";

import ErrorResponse from "../utils/errorResponse.js";

const validateMiddleware = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);

    if (error) {
      throw new ErrorResponse(400, error.details[0].message);
    }
    next();
  };
};
export default validateMiddleware;
