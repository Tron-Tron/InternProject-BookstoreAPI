import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import SuccessResponse from "../utils/SuccessResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { userService } from "./userService.js";
import { staffRequirementService } from "../staffRequirement/staffRequirementService.js";
export const getProfile = asyncMiddleware(async (req, res, next) => {
  const userId = req.user._id;
  const user = await userService.findById(userId).catch((error) => {
    throw new ErrorResponse(400, `No user has id ${userId} ${error}`);
  });
  return new SuccessResponse(200, user).send(res);
});
export const updateProfile = asyncMiddleware(async (req, res, next) => {
  const userId = req.user._id;
  const { username, phoneNumber, balance, password } = req.body;
  const user = await userService.findById(userId);
  if (!user) {
    throw new ErrorResponse(404, "User is not found");
  }
  user.username = username;
  user.balance = balance;
  user.phoneNumber = phoneNumber;
  user.password = password;
  const updatedUser = await userService.save(user);
  if (!updatedUser) {
    throw new ErrorResponse(400, "Can not update");
  }
  return new SuccessResponse(200, updatedUser).send(res);
});
export const registerToBeStaff = asyncMiddleware(async (req, res, next) => {
  const { storeId, roleRegister } = req.body;
  let roleAccept;
  const userId = req.user._id;
  if (roleRegister === "manager") {
    roleAccept = "admin";
  } else {
    roleAccept = "manager";
  }
  const staffRegister = await staffRequirementService.create({
    userId,
    storeId,
    roleRegister,
    roleAccept,
  });
  return new SuccessResponse(201, staffRegister).send(res);
});
export const getAllUsers = asyncMiddleware(async (req, res, next) => {
  const { page, perPage } = req.query;
  const users = await userService.getAll(null, null, null, page, perPage);
  if (!users.length) {
    throw new ErrorResponse(404, "No users");
  }
  return new SuccessResponse(200, users).send(res);
});
export const getUserById = asyncMiddleware(async (req, res, next) => {
  const { userId } = req.params;
  const user = await userService.findById(userId).catch((error) => {
    throw new ErrorResponse(400, `No user has id ${userId}`);
  });
  return new SuccessResponse(200, user).send(res);
});
export const updateUserById = asyncMiddleware(async (req, res, next) => {
  const { userId } = req.params;
  const { username, phoneNumber, balance, password } = req.body;
  const user = await userService.findById(userId);
  if (!user) {
    throw new ErrorResponse(404, "User is not found");
  }
  user.username = username;
  user.phoneNumber = phoneNumber;
  user.password = password;
  user.balance = balance;
  const updatedUser = await userService.save(user);
  if (!updatedUser) {
    throw new ErrorResponse(400, "Can not update");
  }
  return new SuccessResponse(200, updatedUser).send(res);
});

export const deleteUserById = asyncMiddleware(async (req, res, next) => {
  const { userId } = req.params;

  const deletedUser = await userService.findOneAndUpdate(
    { _id: userId },
    { isActive: false },
    { new: true }
  );
  if (!deletedUser) {
    throw new ErrorResponse(404, "No user");
  }
  return new SuccessResponse(200, `Deleted User has id ${userId}`).send(res);
});
