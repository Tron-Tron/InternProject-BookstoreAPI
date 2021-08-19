import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/errorResponse.js";
import SuccessResponse from "../utils/successResponse.js";
import { staffRequirementService } from "./staffRequirementService.js";
import { userService } from "../users/userService.js";
export const getAllRequirementByUserRole = asyncMiddleware(
  async (req, res, next) => {
    const { page, perPage } = req.query;
    const user = req.user;
    let requirements;
    if (user.roles === "admin") {
      requirements = await staffRequirementService.getAll(
        {
          roleAccept: user.roles,
        },
        null,
        null,
        page,
        perPage
      );
    } else {
      const store = await userService.getById({ _id: user._id });
      requirements = await staffRequirementService.getAll(
        {
          roleAccept: user.roles,
          storeId: store.storeId,
        },
        null,
        null,
        page,
        perPage
      );
    }
    if (!requirements.length) {
      throw new ErrorResponse(404, "No requirements");
    }
    return new SuccessResponse(200, requirements).send(res);
  }
);
export const acceptRoleStaff = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const role = req.user.roles;
  let requirement;
  if (role === "admin") {
    requirement = await staffRequirementService.getById(id);
  } else {
    requirement = await staffRequirementService.findOne({
      _id: id,
      storeId: req.user.storeId,
    });
  }
  if (!requirement) {
    throw new ErrorResponse(400, `No requirement has id ${id}`);
  }
  const user = await userService.findOneAndUpdate(
    { _id: requirement.userId },
    { roles: requirement.roleRegister, storeId: requirement.storeId }
  );
  if (!user) {
    throw new ErrorResponse(400, "No user");
  }
  await staffRequirementService.findByIdAndDelete(id);
  return new SuccessResponse(200, "Requirement Role is accepted").send(res);
});
export const rejectRoleStaff = asyncMiddleware(async (req, res, next) => {
  const id = req.params;
  const role = req.user.roles;
  let requirement;
  if (role === "admin") {
    requirement = await staffRequirementService.getById(id);
  } else {
    requirement = await staffRequirementService.findOne({
      _id: id,
      storeId: req.user.storeId,
    });
  }
  if (!requirement) {
    throw new ErrorResponse(400, `No requirement has id ${id}`);
  }
  await staffRequirementService.findByIdAndDelete(id);
  return new SuccessResponse(200, "Requirement Role is rejected");
});
