import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SuccessResponse from "../utils/SuccessResponse.js";
import { customerService } from "./customerService.js";
import geocoder from "./../utils/geocoder.js";
import { userService } from "../users/userService.js";
export const updateProfileCustomer = asyncMiddleware(async (req, res, next) => {
  const { customer_name, province, district, ward, text } = req.body;
  const normalizedAddress = `${text}, ${ward}, ${district}, ${province}`;
  const loc = await geocoder.geocode(normalizedAddress);
  const location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
  };
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
      location,
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
