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
  const password = randomText(6);
  await userService.create({ email, password, roles });
  await staffService.create({
    email,
    staff_name,
    address: { province, district, ward, text },
    store: req.user.storeId,
  });
  await mailService(
    process.env.EMAIL,
    email,
    "THÔNG BÁO CẤP TÀI KHOẢN CHO NHÂN VIÊN",
    `<p>Chào ${staff_name}</p>
    <p>Nhân viên có thông tin đăng nhập như sau: </p><br>
        <i>Email đăng nhập: ${email}</i> <br>
        <i>Mật khẩu: ${password}</i> <br>
        <i>giới hạn quyền sử dụng: ${roles}</i>
    <p>Nhân viên truy cập vào link 
    <a href='http://localhost:3000/api/v1/auth/login'>http://localhost:3000/api/v1/auth/login</a> để đăng nhập
    </p>
    `
  );
  return new SuccessResponse(201, "Please check email").send(res);
});
export const updateProfileStaff = asyncMiddleware(async (req, res, next) => {
  const { staff_name, province, district, ward, text } = req.body;
  const updatedStaff = await staffService.findOneAndUpdate(
    {
      email: req.user.email,
      status: "active",
    },
    {
      staff_name,
      address: {
        province,
        district,
        ward,
        text,
      },
    },
    { new: true }
  );
  if (!updatedStaff) {
    throw new ErrorResponse(404, "Staff is not exist");
  }
  return new SuccessResponse(201, updatedStaff).send(res);
});
export const getProfile = asyncMiddleware(async (req, res, next) => {
  const profile = await staffService.findOne({
    email: req.user.email,
    status: "active",
  });
  if (!profile) {
    throw new ErrorResponse(404, `staff ${email} is not exist`);
  }
  return new SuccessResponse(200, profile).send(res);
});
export const getAllStaffStore = asyncMiddleware(async (req, res, next) => {
  const { page, perPage } = req.query;
  const store = req.user.storeId;
  const staffs = await staffService.getAll(
    { store, status: "active" },
    null,
    "account_detail",
    page,
    perPage
  );
  if (!staffs.length) {
    throw new ErrorResponse(404, "No staffs");
  }
  return new SuccessResponse(200, staffs).send(res);
});
export const deleteStaff = asyncMiddleware(async (req, res, next) => {
  const { staffId } = req.params;
  const store = req.user.storeId;
  if (!staffId.trim()) {
    throw new ErrorResponse(400, "staffId is empty");
  }
  const staff = await staffService.findOne({
    _id: staffId,
    status: "active",
    store,
  });
  if (!staff) {
    throw new ErrorResponse(404, `No staff has id ${staffId}`);
  }
  const checkRoleStaff = await userService.findOne({ email: staff.email });
  if (checkRoleStaff.roles === "manager") {
    throw new ErrorResponse(
      401,
      "You don't have permission to delete this user"
    );
  }
  const deletedStaff = await staffService.findOneAndUpdate(
    { _id: staffId, status: "active", store },
    { status: "disable" },
    { new: true }
  );
  if (!deletedStaff) {
    throw new ErrorResponse(404, ` Staff ${staffId} is not found`);
  }
  return new SuccessResponse(
    200,
    `Staff id ${staffId} is deleted successfully`
  ).send(res);
});
export const getStaffById = asyncMiddleware(async (req, res, next) => {
  const store = req.user.storeId;
  const { staffId } = req.params;
  const staff = await staffService.findOne(
    { _id: staffId, store },
    null,
    "account_detail"
  );
  if (!staff) {
    throw new ErrorResponse(400, `No staff `);
  }
  return new SuccessResponse(200, staff).send(res);
});
export const updateStaffById = asyncMiddleware(async (req, res, next) => {
  const { staffId } = req.params;
  const { staff_name, email, district, province, ward, text } = req.body;
  const storeId = req.user.storeId;
  if (!staffId.trim()) {
    throw new ErrorResponse(400, "staffId is empty");
  }
  const updatedStaff = await staffService.findOneAndUpdate(
    { _id: staffId, status: "active", store: storeId },
    { staff_name, email, address: { district, province, ward, text } },
    { new: true }
  );
  if (!updatedStaff) {
    throw new ErrorResponse(404, `No staff has id ${staffId}`);
  }
  return new SuccessResponse(200, updatedStaff).send(res);
});
