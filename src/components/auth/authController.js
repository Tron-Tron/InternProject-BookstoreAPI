import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import SuccessResponse from "../utils/successResponse.js";
import { userService } from "./../users/userService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./../users/userModel.js";
import ErrorResponse from "../utils/errorResponse.js";
import { cartService } from "../carts/cartService.js";
import { customerService } from "../customers/customerService.js";
import { storeService } from "../store/storeService.js";
import { staffService } from "../staffs/staffService.js";
export const register = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  const [auth, customer] = await Promise.all([
    userService.create({
      email,
      password,
    }),
    customerService.create({ email }),
  ]);
  await cartService.create({
    customer: customer._id,
  });
  return new SuccessResponse(201, auth).send(res);
});
export const registerStoreAccount = asyncMiddleware(async (req, res, next) => {
  const { staff_name, email, password, province, district, ward, text } =
    req.body;
  const auth = await userService.create({
    email,
    password,
    roles: "manager",
  });
  await staffService.create({
    staff_name,
    email,
    address: { province, district, ward, text },
  });
  return new SuccessResponse(201, auth).send(res);
});
export const login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  const isExistEmail = await userService.findOne({ email, status: true });
  if (!isExistEmail) {
    throw new ErrorResponse(404, "User is not found");
  }
  const isMatchPassword = await User.comparePassword(
    password,
    isExistEmail.password
  );
  if (!isMatchPassword) {
    throw new ErrorResponse(404, "Password is incorrect");
  }
  let token;
  if (isExistEmail.roles === "customer" || isExistEmail.roles === "admin") {
    token = jwt.sign(
      {
        _id: isExistEmail._id,
        email: isExistEmail.email,
        roles: isExistEmail.roles,
      },
      process.env.JWT_KEY
    );
  } else {
    const checkStore = await staffService.findOne({ email, status: "active" });
    if (!checkStore) {
      throw new ErrorResponse(404, "This staff is not exist");
    }
    token = jwt.sign(
      {
        _id: isExistEmail._id,
        email: isExistEmail.email,
        roles: isExistEmail.roles,
        storeId: checkStore.store,
      },
      process.env.JWT_KEY
    );
  }

  return new SuccessResponse(200, token).send(res);
});

export const changePassword = asyncMiddleware(async (req, res, next) => {
  const userLogin = req.user._id;
  const { password, newPassword } = req.body;
  const isExistUser = await userService.findOne({
    _id: userLogin,
    status: true,
  });
  if (!isExistUser) {
    throw new ErrorResponse(401, "User is not found");
  }
  const checkPassword = await User.comparePassword(
    password,
    isExistUser.password
  );
  if (!checkPassword) {
    throw new ErrorResponse(401, "Password is incorrect");
  }
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  await userService.findOneAndUpdate(
    { _id: userLogin, status: true },
    { password: hashedPassword }
  );
  return new SuccessResponse(200, "Your password is changed").send(res);
});
