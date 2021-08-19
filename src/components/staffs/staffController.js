import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SuccessResponse from "../utils/SuccessResponse.js";
import { staffService } from "./staffService.js";
import { userService } from "../users/userService.js";
import mailService from "../commons/mail.js";
function randomText(num_of_symbol) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < num_of_symbol; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
export const registerStaff = asyncMiddleware(async (req, res, next) => {
  const { email, staff_name, province, district, ward, text, roles } = req.body;
  const password = randomText(9);
  await Promise.all([
    userService.create({ email, password }),
    staffService.create({
      email,
      staff_name,
      address: { province, district, ward, text },
    }),
  ]);
  await mailService(
    process.env.EMAIL,
    email,
    "THÔNG BÁO CẤP TÀI KHOẢN CHO NHÂN VIÊN",
    `<p>Nhân viên có thông tin đăng nhập như sau: </p><br>
        <i>Email đăng nhập: ${email}</i> <br>
        <i>Mật khẩu: ${password}</i> <br>
        <i>giới hạn quyền sử dụng: ${roles}</i>
    <p>Nhân viên truy cập vào link 
    <a href='http://localhost:3000/api/v1/auth/login'>http://localhost:3000/api/v1/auth/login</a> để đăng nhập
    </p>
    `
  );
  return new SuccessResponse(201, "Please check email");
});
export const updateProfileStaff = asyncMiddleware(async (req, res, next) => {
  const { customer_name, province, district, ward, text } = req.body;
  const updatedCustomer = await customerService.findOneAndUpdate(
    {
      email: req.user.email,
      status: "active",
    },
    {
      customer_name,
      avatar: req.file.filename,
      address: {
        province,
        district,
        ward,
        text,
      },
    },
    { new: true }
  );
  if (!updatedCustomer) {
    throw new ErrorResponse(401, "Customer is not exist");
  }
  return new SuccessResponse(201, updatedCustomer).send(res);
});
export const getProfile = asyncMiddleware(async (req, res, next) => {
  const profile = await customerService.findOne({
    email: req.user.email,
    status: "active",
  });
  if (!profile) {
    throw new ErrorResponse(404, `Customer ${email} is not exist`);
  }
  return new SuccessResponse(200, profile).send(res);
});
export const getAllCustomers = asyncMiddleware(async (req, res, next) => {
  const { page, perPage } = req.query;
  const customers = await customerService.getAll(
    null,
    null,
    null,
    page,
    perPage
  );
  if (!customers.length) {
    throw new ErrorResponse(404, "No customers");
  }
  return new SuccessResponse(200, customers).send(res);
});
export const deleteCustomer = asyncMiddleware(async (req, res, next) => {
  const { customerId } = req.params;
  if (!customerId.trim()) {
    throw new ErrorResponse(400, "customerId is empty");
  }
  const deletedCustomer = await customerService.findOneAndUpdate(
    { _id: customerId, status: "active" },
    { status: "disable" },
    { new: true }
  );

  if (!deletedCustomer) {
    throw new ErrorResponse(404, ` Customer ${customerId} is not found`);
  }
  return new SuccessResponse(
    200,
    `Customer id ${customerId} is deleted successfully`
  ).send(res);
});
