import ErrorResponse from "../components/utils/errorResponse.js";

const authorize =
  (...roles) =>
  (req, res, next) => {
    console.log(req.user.roles);
    console.log(roles);
    if (!req.user) {
      throw new ErrorResponse(401, "Unauthorized");
    }
    if (!roles.includes(req.user.roles)) {
      throw new ErrorResponse(403, "Don't have permission to access this user");
    }
    next();
  };
export default authorize;
