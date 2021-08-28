import jwt from "jsonwebtoken";
import { userService } from "./../components/users/userService.js";
import ErrorResponse from "../components/utils/errorResponse.js";

const jwtAuth = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    return next(new ErrorResponse(401, "Unauthorized"));
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    const user = await userService.findOne({ email: payload.email });
    if (!user) {
      return next(new ErrorResponse(401, "Unauthorized"));
    }
    req.user = payload;
    next();
  } catch (error) {
    return next(new ErrorResponse(401, "Unauthorized"));
  }
};

export default jwtAuth;
