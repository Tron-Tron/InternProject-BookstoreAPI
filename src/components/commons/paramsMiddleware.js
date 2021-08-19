import ErrorResponse from "../utils/errorResponse.js";

const paramsMiddleware = (params) => {
  return (req, res, next) => {
    const reqParamList = Object.keys(req.params);
    const hasAllRequiredParams = params.every((param) =>
      reqParamList.includes(param)
    );
    if (!hasAllRequiredParams) {
      return next(new ErrorResponse(400));
    }
    next();
  };
};
export default paramsMiddleware;
