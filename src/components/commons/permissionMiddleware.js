import ErrorResponse from "../utils/errorResponse.js";

const checkPermission =
  (...permissions) =>
  (req, res, next) => {
    if (!req.user) {
      throw new ErrorResponse(401, "Unauthorization");
    }
    console.log(permissions);

    const isExistPermission = permissions.filter((valuePerm) => {
      return req.user.permissions.some(
        (userPermValue) => userPermValue.permissionKey === valuePerm
      );
    });

    if (isExistPermission.length === 0) {
      throw new ErrorResponse(403, "Don't have permission to do this task");
    }
    next();
  };
export default checkPermission;
